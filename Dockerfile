FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine3.16 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine3.16 AS build
RUN apk add --update npm

ARG NUGET_AUTH_TOKEN
ARG RENDER_GIT_COMMIT
ENV DEPLOYMENT_IDENTIFIER=$RENDER_GIT_COMMIT

WORKDIR /src
COPY ["marcuslindblom.com.nosync.csproj", "web/"]
COPY nuget.config web
RUN dotnet restore "web/marcuslindblom.com.nosync.csproj"
COPY . .
# WORKDIR /src/web
RUN npm i
RUN dotnet build "marcuslindblom.com.nosync.csproj" -c Release -o /app/build

FROM build AS publish
#ARG SHA
RUN dotnet publish "marcuslindblom.com.nosync.csproj" --version-suffix "$DEPLOYMENT_IDENTIFIER" /p:DEPLOYMENT_IDENTIFIER="$DEPLOYMENT_IDENTIFIER" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "marcuslindblom.com.nosync.dll"]
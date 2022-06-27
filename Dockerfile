FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine3.16 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine3.16 AS build
# RUN apk add --update npm
WORKDIR /src
COPY ["marcuslindblom.com.nosync.csproj", "web/"]
# COPY nuget.config web
RUN dotnet restore "web/marcuslindblom.com.nosync.csproj"
COPY . .
#WORKDIR "src/web"
# RUN npm i
RUN dotnet build "marcuslindblom.com.nosync.csproj" -c Release -o /app/build

FROM build AS publish
#ARG SHA
RUN dotnet publish "marcuslindblom.com.nosync.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
#COPY src/web/prod.strife.client.certificate.with.password.pfx /ravendb/prod.strife.client.certificate.with.password.pfx
ENTRYPOINT ["dotnet", "marcuslindblom.com.nosync.dll"]
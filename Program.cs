using System.Reflection;
using Raven.Client.Documents.Indexes;
using Strife;
using Strife.Routing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddStrife(options => {
    options.AfterInitializeDocumentStore = documentStore => IndexCreation.CreateIndexes(Assembly.GetExecutingAssembly(), documentStore);
});

builder.Services.AddHealthChecks();

builder.Services.AddScoped<Layout>();

builder.Services.AddHostedService<TimedHostedService>();
builder.Services.AddHostedService<FathomAnalyticsService>();

builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

app.MapStrife();

app.MapHealthChecks("/healthz");

app.MapGet("/feed", () => "Hello World!");

// app.MapControllerRoute(
//     name: "default",
//     pattern: "{controller=home}/{action=index}/{id?}");

app.Run();

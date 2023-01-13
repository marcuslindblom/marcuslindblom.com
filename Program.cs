using Microsoft.AspNetCore.Mvc;
using Strife;
using Strife.Routing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddStrife();

builder.Services.AddHealthChecks();

builder.Services.AddScoped<Layout>();

builder.Services.AddHostedService<TimedHostedService>();

builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

app.MapStrife();

app.MapHealthChecks("/healthz");

app.MapGet("/feed", () => "Hello World!");

app.MapGet("/.well-known/host-meta", async context =>
{
    var query = context.Request.QueryString;
    await Task.Run(() => context.Response.Redirect("https://fed.brid.gy/.well-known/host-meta" + query.Value));
});

app.MapGet("/.well-known/webfinger", async context =>
{
    var query = context.Request.QueryString;
    await Task.Run(() => context.Response.Redirect("https://fed.brid.gy/.well-known/webfinger" + query.Value));
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=home}/{action=index}/{id?}");

app.Run();

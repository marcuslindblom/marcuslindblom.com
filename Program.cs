using Strife;
using Strife.Routing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddStrife();

builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

app.MapStrife();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=home}/{action=index}/{id?}");

app.Run();

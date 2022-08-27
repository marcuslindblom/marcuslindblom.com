using Strife;
using Strife.Routing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddStrife(options =>
{
    options.AfterInitializeDocumentStore = documentStore =>
        documentStore.Changes().ForAllDocuments().Subscribe(async change => {
            using(var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
                httpClient.DefaultRequestHeaders.Add("AccessKey", "3d252f50-93ac-4220-ab80-a558e076ad63b18fb4ff-62d8-4a07-803e-cc71296d4e6b");
                string APIURL = $"https://api.bunny.net/purge?url=https://marcuslindblom.com";
                await httpClient.PostAsync(APIURL, null);
            }
        });
});

builder.Services.AddHealthChecks();

builder.Services.AddHostedService<TimedHostedService>();

builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

app.MapStrife();

app.MapHealthChecks("/healthz");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=home}/{action=index}/{id?}");

app.Run();

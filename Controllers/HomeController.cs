using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
// using Strife;
using Strife.Binding;
using Strife.Repository.Indexes;

public class HomeController : Controller
{
  private readonly IDocumentStore documentStore;

  public HomeController(IDocumentStore documentStore) => this.documentStore = documentStore;

  // [ResponseCache(VaryByHeader = "Accept-Encoding", Duration = 3600)]
  public async Task<IActionResult> Index([FromContentRoute] Home content)
  {
    using var session = documentStore.OpenAsyncSession();

    // var r = await session.Query<Content>("Content_ByType")
    //   .ProjectInto<ListItem>()
    //   .ToListAsync();

    // Console.WriteLine(r[0].Heading);

    var results = await session.Query<Post>()
                        .Where(x => x.PublishedDate < DateTime.UtcNow)
                        .OrderByDescending(x => x.CreatedAt)
                        .ToListAsync();

    return View(new HomeViewModel(content.Heading, content.Introduction, results));
  }
}

public record ListItem(string Heading, string Url);

public static class UrlHelperExtensions
{
  public static string? ContentURL(this IUrlHelper helper, string id)
  {
    var documentStore = helper.ActionContext.HttpContext.RequestServices.GetRequiredService<IDocumentStore>();

    using var session = documentStore.OpenSession();

    var results = (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
                   where result.Id == id
                   select result.Url
                        ).SingleOrDefault();

    return results;
  }
}
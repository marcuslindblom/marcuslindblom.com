using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
using Strife.Binding;
using Strife.Repository.Indexes;

public class HomeController : Controller
{
  private readonly IDocumentStore documentStore;

  public HomeController(IDocumentStore documentStore) => this.documentStore = documentStore;

  public async Task<IActionResult> Index([FromContentRoute] Home content)
  {
    using var session = documentStore.OpenAsyncSession();

    var results = await session.Query<Post>()
                        .Where(x => x.PublishedDate.Value < DateTime.UtcNow)
                        .OrderByDescending(x => x.CreatedAt)
                        .ToListAsync();

    // var results = await (from result in session.Query<Post>()
    //                     orderby result.CreatedAt descending
    //                      select result).ToListAsync();

    // var results = await (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
    //                      where result.Collection == "Posts"
    //                      let post = RavenQuery.Load<Post>((string)RavenQuery.Metadata(result)["@id"])
    //                      select new PostViewModel
    //                      {
    //                         Id = post.Id,
    //                        Title = post.DisplayName,
    //                        Summary = post.Summary,
    //                        Url = result.Url,
    //                        Mentions = post.Mentions,
    //                      }
    //                     ).ToListAsync();


    return View(new HomeViewModel(content.Heading, content.Introduction, results));
  }
}

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
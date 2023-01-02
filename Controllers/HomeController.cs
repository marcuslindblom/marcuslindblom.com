using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
using Raven.Client.Documents.Indexes;
using Raven.Client.Documents.Queries;
using Strife.Binding;
using Strife.Repository.Indexes;

public class HomeController : Controller
{
  private readonly IDocumentStore documentStore;

  public HomeController(IDocumentStore documentStore)
  {
    this.documentStore = documentStore;
  }
  public async Task<IActionResult> Index([FromContentRoute] Home currentPage)
  {
    using var session = documentStore.OpenAsyncSession();

    // var post = new Post("Well ...", null, null, null);
    // await session.StoreAsync(post);
    // var posts = await session.Query<Post>().Where(x => !x.Id.EndsWith("draft")).ToListAsync();

    //await session.SaveChangesAsync();

    var results = await (from result in session.Query<Content_ByUrl.Result>(Content_ByUrl.IndexDefinitionName)
                        where result.Collection == "Posts"
                        let content = RavenQuery.Load<Post>((string)RavenQuery.Metadata(result)["@id"])
                        select new PostModel(content.Title, content.Mentions, result.Url)
                        ).ToListAsync();
                        

    return View(new HomeViewModel(currentPage.Heading, currentPage.Introduction, results));
  }
}

public record PostModel(string Title, List<WebMention.Post> Mentions, string Url);


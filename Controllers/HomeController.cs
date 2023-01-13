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
  public async Task<IActionResult> Index([FromContentRoute] Home content)
  {
    using var session = documentStore.OpenAsyncSession();

    var results = await (from result in session.Query<Content_ByUrl.Result, Content_ByUrl>()
                        where result.Collection == "Posts"
                        let post = RavenQuery.Load<Post>(result.Id)
                        select new PostViewModel {
                          Title = post.DisplayName,
                          Url = result.Url
                        }
                        ).ToListAsync();


    return View(new HomeViewModel(content.Heading, content.Introduction, results));
  }
}

public class PostViewModel
{
  public string? Title { get; set; }
  public string? Url { get; set; }

  public List<WebMention.Post>? Mentions { get; set; } = new List<WebMention.Post>();
  // public Post? Post { get; set; }
}

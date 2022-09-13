using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
using Strife.Binding;

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
    var posts = await session.Query<Post>().Where(x => !x.Id.EndsWith("draft")).ToListAsync();

    await session.SaveChangesAsync();

    return View(new HomeViewModel(currentPage.Heading, currentPage.Introduction, posts));
  }
}


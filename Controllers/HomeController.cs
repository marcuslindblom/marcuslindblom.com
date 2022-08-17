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
    var viewModel = new HomeViewModel();
    using var session = documentStore.OpenAsyncSession();
    viewModel.Posts = await session.Query<Post>().Take(6).ToListAsync();
    return View(viewModel);
  }
}
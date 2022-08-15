using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class HomeController : Controller
{
  public IActionResult Index([FromContentRoute] Home currentPage)
  {
    var viewModel = new HomeViewModel();
    viewModel.Posts?.AddRange(new List<Post> {
      new Post("Some feature", "Description of the awesome feature"),
      new Post("Some feature", "Description of the awesome feature"),
      new Post("Some feature", "Description of the awesome feature"),
      new Post("Some feature", "Description of the awesome feature"),
      new Post("Some feature", "Description of the awesome feature"),
      new Post("Some feature", "Description of the awesome feature") });
    return View(viewModel);
  }
}
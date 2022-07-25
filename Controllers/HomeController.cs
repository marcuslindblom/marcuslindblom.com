using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class HomeController : Controller
{
  public IActionResult Index([FromContentRoute] Home currentPage) {
    var viewModel = new HomeViewModel();
    viewModel.Posts.Add(new Post { Title = "Hello, world" });
    return View(viewModel);
  }
}
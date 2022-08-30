using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class PostController : Controller
{
  public IActionResult Index([FromContentRoute] Post currentPage) => View(new HomeViewModel());
}
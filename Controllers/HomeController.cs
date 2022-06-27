using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class HomeController : Controller
{
  public IActionResult Index([FromContentRoute] Home currentPage) => View(currentPage);
}
using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class ArticleController : Controller
{
  public IActionResult Index([FromContentRoute] Article currentPage) => View(currentPage);
}
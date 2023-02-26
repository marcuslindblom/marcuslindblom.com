using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class ArticleController : Controller
{
  [ResponseCache(VaryByHeader = "Accept-Encoding", Duration = 3600)]
  public IActionResult Index([FromContentRoute] Article content) => View(content);
}
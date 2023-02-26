using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class PostController : Controller
{
  [ResponseCache(VaryByHeader = "Accept-Encoding", Duration = 3600)]
  public IActionResult Index([FromContentRoute] Post content) => View(content);
}
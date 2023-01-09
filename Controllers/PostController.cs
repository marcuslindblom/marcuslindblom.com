using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class PostController : Controller
{
  public IActionResult Index([FromContentRoute] Post content) => View(content);
}
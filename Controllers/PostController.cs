using Microsoft.AspNetCore.Mvc;

public class PostController : Controller
{
  public IActionResult Index() => Content("Hello World!");
}
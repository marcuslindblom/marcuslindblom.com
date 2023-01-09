using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class JournalController : Controller
{
  public IActionResult Index([FromContentRoute] Journal content) => View(content);
}
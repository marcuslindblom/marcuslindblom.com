using Microsoft.AspNetCore.Mvc;
using Strife.Binding;

public class JournalController : Controller
{
  [ResponseCache(VaryByHeader = "Accept-Encoding", Duration = 3600)]
  public IActionResult Index([FromContentRoute] Journal content) => View(content);
}
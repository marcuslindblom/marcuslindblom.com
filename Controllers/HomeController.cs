using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
using Strife.Binding;

public class HomeController : Controller
{
  private readonly IDocumentStore documentStore;

  public HomeController(IDocumentStore documentStore)
  {
    this.documentStore = documentStore;
  }
  public async Task<IActionResult> Index([FromContentRoute] Home currentPage)
  {
    // var client = new HttpClient();
    // var root = await client.GetFromJsonAsync<WebMention.Root>("https://webmention.io/api/mentions.jf2?domain=marcuslindblom.com&token=ufeSgcy4byQ2weFs8MWs1Q");

    using var session = documentStore.OpenAsyncSession();

    // foreach (var item in root?.Children)
    // {
    //   Console.WriteLine(item.WmTarget.AbsolutePath);
    //   var post = await session.Query<Models_ByFullPath.Result, Models_ByFullPath>().Where(m => m.Path == item.WmTarget.AbsolutePath).OfType<Post>().FirstOrDefaultAsync();
    //   if(post != null && !post.Mentions.Any(m => m.WmId == item.WmId)) {
    //     post.Mentions.Add(item);
    //   }
    // }
    // var page = new Post(null, null, "/test", null, null);
    // await session.StoreAsync(page);
    // await session.SaveChangesAsync();

    // var viewModel = new HomeViewModel();
    var posts = await session.Query<Post>().ToListAsync();
    return View(new HomeViewModel(null, posts));
  }
}
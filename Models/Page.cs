using Wieldy.Core.Models;

public abstract record Page(string? Title, string? Description, string Slug) : INavigationItem
{
  public NavigationItem? NavigationItem { get; set; }
}
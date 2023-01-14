using System.Reflection;

public record Layout {
  public Layout() {
    CanonicalUrl = "https://marcuslindblom.com";
  }
  public string CanonicalUrl { get;set; }
  private string? InformationalVersion { get; init; } = Assembly.GetEntryAssembly()?.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
  public string? Sha => InformationalVersion?.Substring(InformationalVersion.LastIndexOf("-") + 1);
}
using Raven.Client.Documents.Indexes;

public class Content_ByLastModified : AbstractJavaScriptIndexCreationTask
  {
    public class Result
    {
      public DateTime? LastModified { get; set; }
    }

    public Content_ByLastModified()
    {
      // LockMode = IndexLockMode.LockedIgnore;
      Maps = new HashSet<string>
        {
            @"map('Posts', (p) => {
                return {
                  lastModified: p['@metadata']['@last-modified']
                };
            })",
        };
    }
  }
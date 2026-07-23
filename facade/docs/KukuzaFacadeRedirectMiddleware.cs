using System.Net;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Kukuza.Facade;

/// <summary>
/// Reference middleware for the ASP.NET Core BFF that serves the unified React app.
/// It keeps authentication failures in the JSON/API channel and lets the facade
/// perform the browser navigation safely on the same origin.
/// </summary>
public sealed class KukuzaFacadeRedirectMiddleware
{
    private const string CorrelationHeader = "X-Correlation-ID";
    private const string RedirectHeader = "X-Facade-Redirect";

    private readonly RequestDelegate _next;

    public KukuzaFacadeRedirectMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetOrCreateCorrelationId(context);
        context.Response.Headers[CorrelationHeader] = correlationId;

        await _next(context);

        // Do not emit redirects from the API. The browser-side facade owns navigation.
        if (context.Response.HasStarted || !AcceptsJson(context.Request))
            return;

        if (context.Response.StatusCode == (int)HttpStatusCode.Unauthorized)
        {
            context.Response.Headers[RedirectHeader] = "/auth/login";
        }
        else if (context.Response.StatusCode == (int)HttpStatusCode.Forbidden)
        {
            context.Response.Headers[RedirectHeader] = "/forbidden";
        }
    }

    private static string GetOrCreateCorrelationId(HttpContext context)
    {
        var incoming = context.Request.Headers[CorrelationHeader].FirstOrDefault();
        return Guid.TryParse(incoming, out var parsed) ? parsed.ToString("D") : Guid.NewGuid().ToString("D");
    }

    private static bool AcceptsJson(HttpRequest request) =>
        request.Headers.Accept.Any(value => value.Contains("application/json", StringComparison.OrdinalIgnoreCase));
}

public static class KukuzaFacadeMiddlewareExtensions
{
    public static IApplicationBuilder UseKukuzaFacadeRedirects(this IApplicationBuilder app) =>
        app.UseMiddleware<KukuzaFacadeRedirectMiddleware>();
}

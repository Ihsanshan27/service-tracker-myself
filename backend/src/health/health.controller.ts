import { Controller, Get, Header } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  getHealth() {
    return this.healthService.getStatus();
  }

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getLandingPage() {
    const health = await this.healthService.getStatus();
    const statusColor = health.status === 'ok' ? '#16a34a' : '#dc2626';
    const databaseColor = health.database.status === 'connected' ? '#16a34a' : '#dc2626';

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vehicle Service Tracker API</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4efe6;
        --card: #fffaf2;
        --text: #1f2937;
        --muted: #6b7280;
        --border: #e5dccf;
        --accent: #b45309;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background:
          radial-gradient(circle at top left, #fde68a 0%, transparent 30%),
          radial-gradient(circle at bottom right, #fdba74 0%, transparent 28%),
          var(--bg);
        color: var(--text);
      }

      .card {
        width: min(720px, 100%);
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 24px 80px rgba(120, 53, 15, 0.12);
      }

      .eyebrow {
        margin: 0 0 12px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1.05;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin: 28px 0;
      }

      .stat {
        padding: 18px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: #ffffff;
      }

      .label {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
      }

      .value {
        font-size: 1.05rem;
        font-weight: 700;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
      }

      .primary {
        background: #111827;
        color: #fff;
      }

      .secondary {
        border: 1px solid var(--border);
        color: var(--text);
        background: #fff;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <p class="eyebrow">Backend Service</p>
      <h1>Vehicle Service Tracker API</h1>
      <p>Backend service is online and ready to receive requests from the frontend application.</p>

      <section class="grid">
        <article class="stat">
          <span class="label">System Status</span>
          <span class="value" style="color: ${statusColor}">${health.status.toUpperCase()}</span>
        </article>
        <article class="stat">
          <span class="label">Database</span>
          <span class="value" style="color: ${databaseColor}">${health.database.status.toUpperCase()}</span>
        </article>
        <article class="stat">
          <span class="label">Response Time</span>
          <span class="value">${health.responseTimeMs} ms</span>
        </article>
        <article class="stat">
          <span class="label">Timestamp</span>
          <span class="value">${health.timestamp}</span>
        </article>
      </section>

      <div class="actions">
        <a class="primary" href="/health">View JSON Health Check</a>
        <a class="secondary" href="https://vercel.com" target="_blank" rel="noreferrer">Frontend Deploy on Vercel</a>
      </div>
    </main>
  </body>
</html>`;
  }
}

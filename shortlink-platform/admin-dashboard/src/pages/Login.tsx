import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link2, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string; turnstileToken?: string }) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
  const turnstileEnabled = Boolean(siteKey);

  useEffect(() => {
    if (!turnstileEnabled) return;

    let widgetId: string | null = null;
    let interval: number | null = null;

    const renderWidget = () => {
      if (!turnstileRef.current || !window.turnstile) return;
      if (widgetId) return;
      const isCompact = window.innerWidth < 420;
      widgetId = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
        theme: 'light',
        size: isCompact ? 'compact' : 'normal',
      });
    };

    renderWidget();
    if (!window.turnstile) {
      interval = window.setInterval(renderWidget, 200);
    }

    return () => {
      if (interval) window.clearInterval(interval);
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [siteKey, turnstileEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      setIsLoading(false);
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setError('请完成人机验证');
      setIsLoading(false);
      return;
    }

    const result = await onLogin({
      username,
      password,
      turnstileToken: turnstileEnabled ? turnstileToken : undefined,
    });

    if (!result.success) {
      setError(result.error || '登录失败');
    }

    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(https://api.furry.ist/furry-img)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm" />

      <Card className="w-full max-w-md relative z-10 shadow-xl overflow-hidden gap-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/60">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
          <span className="ml-auto text-xs text-muted-foreground">AUTH_GATE</span>
        </div>
        <CardHeader className="space-y-4 text-center pt-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Link2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">ShortLink Admin</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              登录管理后台以创建和管理短链接
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Turnstile 验证</Label>
              <div className="rounded-lg border border-border bg-background p-3">
                <div ref={turnstileRef} />
              </div>
              {!turnstileEnabled && (
                <p className="text-xs text-muted-foreground">
                  请在 `.env` 中设置 `VITE_TURNSTILE_SITE_KEY`，否则无法验证
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || (turnstileEnabled && !turnstileToken)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

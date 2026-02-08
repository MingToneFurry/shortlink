import { useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Link2, 
  ArrowLeft, 
  Loader2, 
  Key,
  Shield,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface SettingsProps {
  username: string | null;
}

export function Settings({ username }: SettingsProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('璇峰～鍐欐墍鏈夊瓧娈?);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('鏂板瘑鐮侀暱搴﹁嚦灏?浣?);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('涓ゆ杈撳叆鐨勬柊瀵嗙爜涓嶄竴鑷?);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.changePassword({ oldPassword, newPassword });
      setShowSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('瀵嗙爜淇敼鎴愬姛');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '瀵嗙爜淇敼澶辫触');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Link2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  ShortLink Admin
                </h1>
              </Link>
            </div>
            
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                杩斿洖棣栭〉
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                璐︽埛淇℃伅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">鐢ㄦ埛鍚?/Label>
                  <p className="text-lg font-medium">{username}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">瑙掕壊</Label>
                  <p className="text-lg font-medium">绠＄悊鍛?/p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                淇敼瀵嗙爜
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showSuccess && (
                <Alert className="mb-4 bg-accent border-border">
                  <Check className="w-4 h-4 text-primary" />
                  <AlertDescription className="text-primary">
                    瀵嗙爜淇敼鎴愬姛锛佽浣跨敤鏂板瘑鐮佺櫥褰曘€?                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">褰撳墠瀵嗙爜</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">鏂板瘑鐮?/Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="璇疯緭鍏ユ柊瀵嗙爜锛堣嚦灏?浣嶏級"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">纭鏂板瘑鐮?/Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="璇峰啀娆¤緭鍏ユ柊瀵嗙爜"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-start gap-2 p-4 bg-accent rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">瀹夊叏鎻愮ず</p>
                    <p className="mt-1">
                      璇蜂娇鐢ㄥ己瀵嗙爜锛堝寘鍚ぇ灏忓啓瀛楁瘝銆佹暟瀛楀拰鐗规畩瀛楃锛夛紝骞跺畾鏈熸洿鎹㈠瘑鐮佷互淇濊瘉璐︽埛瀹夊叏銆?                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      淇敼涓?..
                    </>
                  ) : (
                    '淇敼瀵嗙爜'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>绯荤粺淇℃伅</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">骞冲彴鐗堟湰</span>
                  <span className="font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">鍚庣鏋舵瀯</span>
                  <span className="font-medium">Cloudflare Workers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">鏁版嵁瀛樺偍</span>
                  <span className="font-medium">Cloudflare KV + D1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">璇锋眰闄愬埗</span>
                  <span className="font-medium text-primary">鏃犻檺鍒?/span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}



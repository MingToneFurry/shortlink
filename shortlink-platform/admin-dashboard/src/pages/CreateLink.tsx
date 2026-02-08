import { useState } from 'react';
import { useLinks } from '@/hooks/useLinks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Link2, 
  ArrowLeft, 
  Loader2, 
  Copy, 
  Check,
  Clock,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function CreateLink() {
  const [url, setUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showInterstitial, setShowInterstitial] = useState(true);
  const [delay, setDelay] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  
  const { createLink } = useLinks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('请输入目标URL');
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      toast.error('请输入有效的URL格式');
      return;
    }

    // Validate custom suffix if provided
    if (customSuffix && !/^[a-zA-Z0-9_-]+$/.test(customSuffix)) {
      toast.error('自定义后缀只能包含字母、数字、下划线和连字符');
      return;
    }

    if (customSuffix && (customSuffix.length < 3 || customSuffix.length > 32)) {
      toast.error('自定义后缀长度需在3-32位之间');
      return;
    }

    setIsSubmitting(true);

    const result = await createLink({
      url: url.trim(),
      customSuffix: customSuffix.trim() || undefined,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      showInterstitial,
      delay: showInterstitial ? delay : undefined,
    });

    if (result.success && result.link) {
      toast.success('短链接创建成功！');
      setCreatedLink(`${window.location.origin}/s/${result.link.shortCode}`);
    } else {
      toast.error(result.error || '创建失败');
    }

    setIsSubmitting(false);
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      toast.success('链接已复制到剪贴板');
    }
  };

  const handleReset = () => {
    setUrl('');
    setCustomSuffix('');
    setTitle('');
    setDescription('');
    setShowInterstitial(true);
    setDelay(5);
    setCreatedLink(null);
  };

  if (createdLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ShortLink Admin
                  </h1>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                短链接创建成功！
              </h2>
              <p className="text-gray-500 mb-8">
                您的短链接已准备就绪，可以开始使用了
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-500 mb-2">您的短链接</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-lg font-mono bg-white px-4 py-2 rounded-lg border">
                    {createdLink}
                  </code>
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  创建另一个
                </Button>
                <Link to="/links">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                    查看所有链接
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ShortLink Admin
                </h1>
              </Link>
            </div>
            
            <Link to="/links">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回列表
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>创建短链接</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url">
                  目标 URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/long-url..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
                <p className="text-sm text-gray-500">
                  输入您想要缩短的完整URL地址
                </p>
              </div>

              {/* Custom Suffix */}
              <div className="space-y-2">
                <Label htmlFor="suffix">自定义后缀（可选）</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-mono">/s/</span>
                  <Input
                    id="suffix"
                    placeholder="my-link"
                    value={customSuffix}
                    onChange={(e) => setCustomSuffix(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 font-mono"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  留空将自动生成随机后缀。只能使用字母、数字、下划线和连字符，长度3-32位。
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">标题（可选）</Label>
                <Input
                  id="title"
                  placeholder="链接标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">描述（可选）</Label>
                <Input
                  id="description"
                  placeholder="链接描述，将显示在中间页面"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              {/* Interstitial Settings */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showInterstitial ? (
                      <Eye className="w-5 h-5 text-purple-500" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                    <Label htmlFor="interstitial" className="cursor-pointer">
                      显示中间页面
                    </Label>
                  </div>
                  <Switch
                    id="interstitial"
                    checked={showInterstitial}
                    onCheckedChange={setShowInterstitial}
                    disabled={isSubmitting}
                  />
                </div>

                {showInterstitial && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        倒计时时间
                      </Label>
                      <Badge variant="secondary">{delay} 秒</Badge>
                    </div>
                    <Slider
                      value={[delay]}
                      onValueChange={(value) => setDelay(value[0])}
                      min={1}
                      max={30}
                      step={1}
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-gray-500">
                      用户需要在中间页面等待倒计时结束后才能跳转
                    </p>
                  </div>
                )}

                {!showInterstitial && (
                  <p className="text-sm text-green-600">
                    用户访问短链接后将直接跳转到目标页面
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Link to="/links" className="flex-1">
                  <Button variant="outline" className="w-full" disabled={isSubmitting}>
                    取消
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    '创建短链接'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

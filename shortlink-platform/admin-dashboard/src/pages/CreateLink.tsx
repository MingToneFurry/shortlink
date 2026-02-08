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
      toast.error('璇疯緭鍏ョ洰鏍嘦RL');
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      toast.error('璇疯緭鍏ユ湁鏁堢殑URL鏍煎紡');
      return;
    }

    // Validate custom suffix if provided
    if (customSuffix && !/^[a-zA-Z0-9_-]+$/.test(customSuffix)) {
      toast.error('鑷畾涔夊悗缂€鍙兘鍖呭惈瀛楁瘝銆佹暟瀛椼€佷笅鍒掔嚎鍜岃繛瀛楃');
      return;
    }

    if (customSuffix && (customSuffix.length < 3 || customSuffix.length > 32)) {
      toast.error('鑷畾涔夊悗缂€闀垮害闇€鍦?-32浣嶄箣闂?);
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
      toast.success('鐭摼鎺ュ垱寤烘垚鍔燂紒');
      setCreatedLink(`${window.location.origin}/s/${result.link.shortCode}`);
    } else {
      toast.error(result.error || '鍒涘缓澶辫触');
    }

    setIsSubmitting(false);
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      toast.success('閾炬帴宸插鍒跺埌鍓创鏉?);
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
            </div>
          </div>
        </header>

        {/* Success Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                鐭摼鎺ュ垱寤烘垚鍔燂紒
              </h2>
              <p className="text-muted-foreground mb-8">
                鎮ㄧ殑鐭摼鎺ュ凡鍑嗗灏辩华锛屽彲浠ュ紑濮嬩娇鐢ㄤ簡
              </p>

              <div className="bg-accent rounded-xl p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">鎮ㄧ殑鐭摼鎺?/p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-lg font-mono bg-card px-4 py-2 rounded-lg border">
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
                  鍒涘缓鍙︿竴涓?                </Button>
                <Link to="/links">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    鏌ョ湅鎵€鏈夐摼鎺?                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            
            <Link to="/links">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                杩斿洖鍒楄〃
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>鍒涘缓鐭摼鎺?/CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url">
                  鐩爣 URL <span className="text-destructive">*</span>
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
                <p className="text-sm text-muted-foreground">
                  杈撳叆鎮ㄦ兂瑕佺缉鐭殑瀹屾暣URL鍦板潃
                </p>
              </div>

              {/* Custom Suffix */}
              <div className="space-y-2">
                <Label htmlFor="suffix">鑷畾涔夊悗缂€锛堝彲閫夛級</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-mono">/s/</span>
                  <Input
                    id="suffix"
                    placeholder="my-link"
                    value={customSuffix}
                    onChange={(e) => setCustomSuffix(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 font-mono"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  鐣欑┖灏嗚嚜鍔ㄧ敓鎴愰殢鏈哄悗缂€銆傚彧鑳戒娇鐢ㄥ瓧姣嶃€佹暟瀛椼€佷笅鍒掔嚎鍜岃繛瀛楃锛岄暱搴?-32浣嶃€?                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">鏍囬锛堝彲閫夛級</Label>
                <Input
                  id="title"
                  placeholder="閾炬帴鏍囬"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">鎻忚堪锛堝彲閫夛級</Label>
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
                      <Eye className="w-5 h-5 text-primary" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    )}
                    <Label htmlFor="interstitial" className="cursor-pointer">
                      鏄剧ず涓棿椤甸潰
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
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        鍊掕鏃舵椂闂?                      </Label>
                      <Badge variant="secondary">{delay} 绉?/Badge>
                    </div>
                    <Slider
                      value={[delay]}
                      onValueChange={(value) => setDelay(value[0])}
                      min={1}
                      max={30}
                      step={1}
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-muted-foreground">
                      鐢ㄦ埛闇€瑕佸湪涓棿椤甸潰绛夊緟鍊掕鏃剁粨鏉熷悗鎵嶈兘璺宠浆
                    </p>
                  </div>
                )}

                {!showInterstitial && (
                  <p className="text-sm text-primary">
                    鐢ㄦ埛璁块棶鐭摼鎺ュ悗灏嗙洿鎺ヨ烦杞埌鐩爣椤甸潰
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Link to="/links" className="flex-1">
                  <Button variant="outline" className="w-full" disabled={isSubmitting}>
                    鍙栨秷
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      鍒涘缓涓?..
                    </>
                  ) : (
                    '鍒涘缓鐭摼鎺?
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



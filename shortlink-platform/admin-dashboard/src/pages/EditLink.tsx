import { useState, useEffect } from 'react';
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
  Clock,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function EditLink() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { getLink, updateLink } = useLinks();
  const navigate = useNavigate();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showInterstitial, setShowInterstitial] = useState(true);
  const [delay, setDelay] = useState(5);
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadLink = async () => {
      if (!shortCode) return;
      
      const result = await getLink(shortCode);
      if (result.success && result.link) {
        setUrl(result.link.url);
        setTitle(result.link.title || '');
        setDescription(result.link.description || '');
        setShowInterstitial(result.link.showInterstitial !== false);
        setDelay(result.link.delay || 5);
        setActive(result.link.active !== false);
      } else {
        toast.error('閾炬帴涓嶅瓨鍦?);
        navigate('/links');
      }
      setIsLoading(false);
    };

    loadLink();
  }, [shortCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('璇疯緭鍏ョ洰鏍嘦RL');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('璇疯緭鍏ユ湁鏁堢殑URL鏍煎紡');
      return;
    }

    if (!shortCode) return;

    setIsSubmitting(true);

    const result = await updateLink(shortCode, {
      url: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      showInterstitial,
      delay: showInterstitial ? delay : undefined,
      active,
    });

    if (result.success) {
      toast.success('閾炬帴鏇存柊鎴愬姛');
      navigate('/links');
    } else {
      toast.error(result.error || '鏇存柊澶辫触');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
            <div className="flex items-center justify-between">
              <CardTitle>缂栬緫鐭摼鎺?/CardTitle>
              <Badge variant="outline" className="font-mono text-lg">
                /s/{shortCode}
              </Badge>
            </div>
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
                  placeholder="閾炬帴鎻忚堪锛屽皢鏄剧ず鍦ㄤ腑闂撮〉闈?
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  {active ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-destructive" />
                  )}
                  <Label htmlFor="active" className="cursor-pointer">
                    閾炬帴鐘舵€?                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${active ? 'text-primary' : 'text-destructive'}`}>
                    {active ? '宸插惎鐢? : '宸茬鐢?}
                  </span>
                  <Switch
                    id="active"
                    checked={active}
                    onCheckedChange={setActive}
                    disabled={isSubmitting}
                  />
                </div>
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
                  </div>
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
                      淇濆瓨涓?..
                    </>
                  ) : (
                    '淇濆瓨淇敼'
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


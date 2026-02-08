import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStats } from '@/hooks/useAnalytics';
import { 
  Link2, 
  MousePointerClick, 
  TrendingUp, 
  Activity,
  Plus,
  ExternalLink,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  username: string | null;
  onLogout: () => void;
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const { stats, isLoading, refetch } = useStats();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const statCards = [
    {
      title: '鎬婚摼鎺ユ暟',
      value: stats?.totalLinks || 0,
      icon: Link2,
      color: 'bg-primary',
      trend: '+12%',
    },
    {
      title: '鎬荤偣鍑婚噺',
      value: stats?.totalClicks || 0,
      icon: MousePointerClick,
      color: 'bg-slate-700',
      trend: '+28%',
    },
    {
      title: '浠婃棩鐐瑰嚮',
      value: stats?.todayClicks || 0,
      icon: TrendingUp,
      color: 'bg-emerald-600',
      trend: '+5%',
    },
    {
      title: '娲昏穬閾炬帴',
      value: stats?.activeLinks || 0,
      icon: Activity,
      color: 'bg-amber-500',
      trend: '+8%',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Link2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  ShortLink Admin
                </h1>
                <p className="text-xs text-muted-foreground">{currentTime.toLocaleString('zh-CN')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">娆㈣繋, {username}</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                閫€鍑?              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">
                      {isLoading ? '-' : card.value.toLocaleString()}
                    </p>
                    <span className="text-xs text-primary font-medium mt-1 inline-block">
                      {card.trend} 杈冧笂鏈?                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">蹇嵎鎿嶄綔</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/links/new">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent/70 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">鍒涘缓鐭摼鎺?/span>
                  </Button>
                </Link>
                
                <Link to="/links">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent/70 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">绠＄悊閾炬帴</span>
                  </Button>
                </Link>
                
                <Link to="/analytics">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent/70 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">鏁版嵁鍒嗘瀽</span>
                  </Button>
                </Link>
                
                <Link to="/settings">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent/70 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">绯荤粺璁剧疆</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">绯荤粺鐘舵€?/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">绯荤粺鐘舵€?/span>
                  <span className="px-2 py-1 bg-accent text-primary text-xs rounded-full font-medium">
                    姝ｅ父杩愯
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API 鐘舵€?/span>
                  <span className="px-2 py-1 bg-accent text-primary text-xs rounded-full font-medium">
                    鍦ㄧ嚎
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">鏁版嵁搴?/span>
                  <span className="px-2 py-1 bg-accent text-primary text-xs rounded-full font-medium">
                    宸茶繛鎺?                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">缂撳瓨鏈嶅姟</span>
                  <span className="px-2 py-1 bg-accent text-primary text-xs rounded-full font-medium">
                    姝ｅ父
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">鏈€鍚庢洿鏂?/span>
                    <span className="text-foreground">{currentTime.toLocaleTimeString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


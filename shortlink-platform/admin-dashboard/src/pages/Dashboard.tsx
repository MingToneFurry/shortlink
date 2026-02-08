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
      title: '总链接数',
      value: stats?.totalLinks || 0,
      icon: Link2,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%',
    },
    {
      title: '总点击量',
      value: stats?.totalClicks || 0,
      icon: MousePointerClick,
      color: 'from-purple-500 to-pink-500',
      trend: '+28%',
    },
    {
      title: '今日点击',
      value: stats?.todayClicks || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      trend: '+5%',
    },
    {
      title: '活跃链接',
      value: stats?.activeLinks || 0,
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      trend: '+8%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ShortLink Admin
                </h1>
                <p className="text-xs text-gray-500">{currentTime.toLocaleString('zh-CN')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">欢迎, {username}</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
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
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">
                      {isLoading ? '-' : card.value.toLocaleString()}
                    </p>
                    <span className="text-xs text-green-600 font-medium mt-1 inline-block">
                      {card.trend} 较上月
                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
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
              <CardTitle className="text-lg">快捷操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/links/new">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">创建短链接</span>
                  </Button>
                </Link>
                
                <Link to="/links">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">管理链接</span>
                  </Button>
                </Link>
                
                <Link to="/analytics">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">数据分析</span>
                  </Button>
                </Link>
                
                <Link to="/settings">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-medium">系统设置</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">系统状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">系统状态</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    正常运行
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API 状态</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    在线
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">数据库</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    已连接
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">缓存服务</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    正常
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">最后更新</span>
                    <span className="text-gray-900">{currentTime.toLocaleTimeString('zh-CN')}</span>
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

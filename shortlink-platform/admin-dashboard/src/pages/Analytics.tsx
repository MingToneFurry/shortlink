import { useState } from 'react';
import { useLinks } from '@/hooks/useLinks';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Link2, 
  ArrowLeft, 
  Loader2, 
  MousePointerClick,
  Globe,
  Smartphone,
  Chrome,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  Monitor
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#0f766e', '#1d4ed8', '#b45309', '#16a34a', '#0ea5a5', '#64748b'];

export function Analytics() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [days, setDays] = useState('30');
  const { links } = useLinks(1, 100);
  const { analytics, isLoading } = useAnalytics(shortCode || '', parseInt(days));

  const selectedLink = links.find(l => l.shortCode === shortCode);

  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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
            
            <div className="flex items-center gap-4">
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="鏃堕棿鑼冨洿" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">鏈€杩?澶?/SelectItem>
                  <SelectItem value="30">鏈€杩?0澶?/SelectItem>
                  <SelectItem value="90">鏈€杩?0澶?/SelectItem>
                </SelectContent>
              </Select>
              
              <Link to="/links">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  杩斿洖鍒楄〃
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !analytics ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <MousePointerClick className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">鏆傛棤鏁版嵁</h3>
            <p className="text-muted-foreground mt-1">璇ラ摼鎺ヨ繕娌℃湁璁块棶璁板綍</p>
          </div>
        ) : (
          <>
            {/* Link Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold">/s/{shortCode}</h2>
                      <Badge variant="secondary" className="font-mono">
                        {formatNumber(analytics.totalClicks)} 鐐瑰嚮
                      </Badge>
                    </div>
                    <a 
                      href={selectedLink?.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {selectedLink?.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      鍒涘缓: {selectedLink ? new Date(selectedLink.createdAt).toLocaleDateString('zh-CN') : '-'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      缁熻鍛ㄦ湡: {days}澶?                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <MousePointerClick className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">鎬荤偣鍑婚噺</p>
                      <p className="text-2xl font-bold">{formatNumber(analytics.totalClicks)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">鏃ュ潎鐐瑰嚮</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(Math.round(analytics.totalClicks / parseInt(days)))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">鍥藉/鍦板尯</p>
                      <p className="text-2xl font-bold">{analytics.countries.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">璁惧绫诲瀷</p>
                      <p className="text-2xl font-bold">{analytics.devices.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="daily" className="space-y-6">
              <TabsList>
                <TabsTrigger value="daily">姣忔棩瓒嬪娍</TabsTrigger>
                <TabsTrigger value="hourly">鏃舵鍒嗗竷</TabsTrigger>
                <TabsTrigger value="devices">璁惧鍒嗘瀽</TabsTrigger>
                <TabsTrigger value="geo">鍦扮悊浣嶇疆</TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      姣忔棩鐐瑰嚮瓒嬪娍
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.daily}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: number) => [value, '鐐瑰嚮閲?]}
                            labelFormatter={(label) => formatDate(label as string)}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#0f766e" 
                            fillOpacity={0.2} 
                            fill="#0f766e" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hourly">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      24灏忔椂鍒嗗竷
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.hourly}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="hour" 
                            tickFormatter={(hour) => `${hour}:00`}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: number) => [value, '鐐瑰嚮閲?]}
                            labelFormatter={(label) => `${label}:00 - ${label}:59`}
                          />
                          <Bar dataKey="value" fill="#0f766e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        璁惧绫诲瀷
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.devices}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analytics.devices.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [value, '鐐瑰嚮閲?]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {analytics.devices.map((device, index) => (
                          <div key={device.name} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{device.name}: {device.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Chrome className="w-5 h-5" />
                        娴忚鍣ㄥ垎甯?                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.browsers}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analytics.browsers.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [value, '鐐瑰嚮閲?]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {analytics.browsers.map((browser, index) => (
                          <div key={browser.name} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{browser.name}: {browser.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="geo">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      鍥藉/鍦板尯鍒嗗竷
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={analytics.countries.slice(0, 10)} 
                          layout="vertical"
                          margin={{ left: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            width={60}
                          />
                          <Tooltip formatter={(value: number) => [value, '鐐瑰嚮閲?]} />
                          <Bar dataKey="value" fill="#1d4ed8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}


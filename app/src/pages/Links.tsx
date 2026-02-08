import { useState } from 'react';
import { useLinks } from '@/hooks/useLinks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Link2, 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  ExternalLink, 
  BarChart3, 
  Edit, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Links() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const { links, pagination, isLoading, deleteLink } = useLinks(page, 20);
  const navigate = useNavigate();

  const filteredLinks = links.filter(link => 
    link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('链接已复制到剪贴板');
  };

  const handleDelete = async () => {
    if (!selectedLink) return;
    
    const result = await deleteLink(selectedLink);
    if (result.success) {
      toast.success('短链接已删除');
    } else {
      toast.error(result.error || '删除失败');
    }
    setDeleteDialogOpen(false);
    setSelectedLink(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            
            <div className="flex items-center gap-4">
              <Link to="/links/new">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  创建链接
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>短链接管理</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索链接..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">暂无短链接</h3>
                <p className="text-gray-500 mt-1">创建您的第一个短链接开始使用</p>
                <Link to="/links/new">
                  <Button className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500">
                    <Plus className="w-4 h-4 mr-2" />
                    创建链接
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>短链接</TableHead>
                        <TableHead>目标地址</TableHead>
                        <TableHead>标题</TableHead>
                        <TableHead>点击数</TableHead>
                        <TableHead>中间页</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.map((link) => {
                        const shortUrl = `${window.location.origin}/s/${link.shortCode}`;
                        return (
                          <TableRow key={link.shortCode}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  /s/{link.shortCode}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopy(shortUrl)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline truncate max-w-xs block"
                              >
                                {link.url}
                              </a>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-700">
                                {link.title || '-'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-mono">
                                {link.clicks?.toLocaleString() || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {link.showInterstitial ? (
                                <div className="flex items-center gap-1 text-amber-600">
                                  <Eye className="w-4 h-4" />
                                  <span className="text-xs">{link.delay || 5}s</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-green-600">
                                  <EyeOff className="w-4 h-4" />
                                  <span className="text-xs">直接跳转</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-500">
                                {formatDate(link.createdAt)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleCopy(shortUrl)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    复制链接
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(shortUrl, '_blank')}>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    访问链接
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/analytics/${link.shortCode}`)}>
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    查看数据
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/links/${link.shortCode}/edit`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    编辑
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedLink(link.shortCode);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-500">
                      显示 {(page - 1) * 20 + 1} - {Math.min(page * 20, pagination.total)} 条，
                      共 {pagination.total} 条
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        {page} / {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除短链接 <code>/s/{selectedLink}</code> 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

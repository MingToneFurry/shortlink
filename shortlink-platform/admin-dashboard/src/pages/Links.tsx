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
    toast.success('閾炬帴宸插鍒跺埌鍓创鏉?);
  };

  const handleDelete = async () => {
    if (!selectedLink) return;
    
    const result = await deleteLink(selectedLink);
    if (result.success) {
      toast.success('鐭摼鎺ュ凡鍒犻櫎');
    } else {
      toast.error(result.error || '鍒犻櫎澶辫触');
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
              <Link to="/links/new">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  鍒涘缓閾炬帴
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
            <CardTitle>鐭摼鎺ョ鐞?/CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="鎼滅储閾炬帴..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">鏆傛棤鐭摼鎺?/h3>
                <p className="text-muted-foreground mt-1">鍒涘缓鎮ㄧ殑绗竴涓煭閾炬帴寮€濮嬩娇鐢?/p>
                <Link to="/links/new">
                  <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    鍒涘缓閾炬帴
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>鐭摼鎺?/TableHead>
                        <TableHead>鐩爣鍦板潃</TableHead>
                        <TableHead>鏍囬</TableHead>
                        <TableHead>鐐瑰嚮鏁?/TableHead>
                        <TableHead>涓棿椤?/TableHead>
                        <TableHead>鍒涘缓鏃堕棿</TableHead>
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
                                <span className="font-mono text-sm bg-accent px-2 py-1 rounded">
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
                                className="text-sm text-primary hover:underline truncate max-w-xs block"
                              >
                                {link.url}
                              </a>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-foreground">
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
                                <div className="flex items-center gap-1 text-primary">
                                  <Eye className="w-4 h-4" />
                                  <span className="text-xs">{link.delay || 5}s</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <EyeOff className="w-4 h-4" />
                                  <span className="text-xs">鐩存帴璺宠浆</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
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
                                    澶嶅埗閾炬帴
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(shortUrl, '_blank')}>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    璁块棶閾炬帴
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/analytics/${link.shortCode}`)}>
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    鏌ョ湅鏁版嵁
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/links/${link.shortCode}/edit`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    缂栬緫
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => {
                                      setSelectedLink(link.shortCode);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    鍒犻櫎
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
                    <p className="text-sm text-muted-foreground">
                      鏄剧ず {(page - 1) * 20 + 1} - {Math.min(page * 20, pagination.total)} 鏉★紝
                      鍏?{pagination.total} 鏉?                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
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
            <DialogTitle>纭鍒犻櫎</DialogTitle>
            <DialogDescription>
              纭畾瑕佸垹闄ょ煭閾炬帴 <code>/s/{selectedLink}</code> 鍚楋紵姝ゆ搷浣滀笉鍙挙閿€銆?            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              鍙栨秷
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              鍒犻櫎
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


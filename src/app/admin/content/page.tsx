'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContent, useDeleteContent } from '@/api/hooks/useContent';
import { toast } from 'sonner';
import { Content, ContentType } from '@/api/types/content';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Search,
  Plus,
  Loader2,
  Edit,
  Trash,
  Eye,
  ArrowUpDown,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  FileEdit,
} from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ContentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const contentType = typeFilter !== 'all' ? typeFilter as ContentType : undefined;
  const publishedStatus = publishedFilter !== 'all' 
    ? publishedFilter === 'published' 
    : undefined;

  const { data: contentItems, isLoading, error } = useContent({
    type: contentType,
    published: publishedStatus,
    search: searchQuery.length > 2 ? searchQuery : undefined,
  });
  
  const { mutateAsync: deleteContent, isPending: isDeleting } = useDeleteContent();

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort content
  const filteredContent = contentItems
    ? contentItems.sort((a, b) => {
        let comparison = 0;

        if (sortField === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (sortField === 'type') {
          comparison = a.type.localeCompare(b.type);
        } else if (sortField === 'created_at') {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }

        return sortDirection === 'desc' ? comparison * -1 : comparison;
      })
    : [];
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle content deletion
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteContent(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  // Get content type badge
  const getContentTypeBadge = (type: ContentType) => {
    switch (type) {
      case ContentType.Banner:
        return <Badge className="bg-blue-500"><ImageIcon className="mr-1 h-3 w-3" /> Banner</Badge>;
      case ContentType.Promotion:
        return <Badge className="bg-orange-500"><LayoutGrid className="mr-1 h-3 w-3" /> Promosi</Badge>;
      case ContentType.Page:
        return <Badge className="bg-green-500"><FileText className="mr-1 h-3 w-3" /> Halaman</Badge>;
      case ContentType.Blog:
        return <Badge className="bg-purple-500"><FileEdit className="mr-1 h-3 w-3" /> Blog</Badge>;
      default:
        return <Badge variant="outline">Lainnya</Badge>;
    }
  };

  // Handle errors
  if (error) {
    toast.error('Gagal memuat konten. Silakan coba lagi.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Konten</h1>
        <Button onClick={() => router.push('/admin/content/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Konten
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Konten</CardTitle>
          <CardDescription>
            Kelola semua konten untuk website Agro Mandiri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari judul konten..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Jenis Konten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value={ContentType.Banner}>Banner</SelectItem>
                  <SelectItem value={ContentType.Promotion}>Promosi</SelectItem>
                  <SelectItem value={ContentType.Page}>Halaman</SelectItem>
                  <SelectItem value={ContentType.Blog}>Blog</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={publishedFilter}
                onValueChange={setPublishedFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">Dipublikasi</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Judul
                        {sortField === 'title' && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Jenis
                        {sortField === 'type' && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Tanggal Dibuat
                        {sortField === 'created_at' && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Tidak ada konten yang ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="font-medium">{content.title}</div>
                          <div className="text-xs text-muted-foreground">{content.slug}</div>
                        </TableCell>
                        <TableCell>
                          {getContentTypeBadge(content.type)}
                        </TableCell>
                        <TableCell>
                          <div>{formatDate(content.created_at)}</div>
                          {content.published_at && (
                            <div className="text-xs text-muted-foreground">
                              Dipublikasi: {formatDate(content.published_at)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {content.is_published ? (
                            <Badge variant="default" className="bg-green-500">Terpublikasi</Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {content.is_published && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(`/${content.type}/${content.slug}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/admin/content/edit?id=${content.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(content.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredContent.length} dari {contentItems?.length || 0} konten
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus konten ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus Konten'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AiOutlineInstagram,
  AiFillYoutube,
} from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import {
  Search,
  Users,
  BookmarkPlus,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Creator } from '@/types/creator';
import { EmailViewer } from '@/components/email/EmailViewer';

// Update the interface to only require the creator prop
interface CreatorListItemProps {
  creator: Creator;
}

import { supabase } from '@/lib/supabase'

// Add this formatter function
const formatFollowerCount = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Add this type for follower ranges
type FollowerRange = {
  label: string;
  min: number;
  max: number | null;  // null for "above" ranges
};

// Update the follower ranges to use actual numbers
const followerRanges: FollowerRange[] = [
  { label: 'All', min: 0, max: null },
  { label: '10K - 50K', min: 10_000, max: 50_000 },
  { label: '50K - 100K', min: 50_000, max: 100_000 },
  { label: '100K - 500K', min: 100_000, max: 500_000 },
  { label: '500K - 1M', min: 500_000, max: 1_000_000 },
  { label: '1M+', min: 1_000_000, max: null },
];

// Add debounce utility at the top
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Keep the cache mechanism
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Create a shared Analytics Modal component
function AnalyticsModal({ 
  isOpen, 
  onClose, 
  creator 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  creator: Creator; 
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[70vw] h-[80vh] p-0"
        onInteractOutside={() => onClose()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <DialogTitle className="text-lg font-semibold">
              Analytics for {creator.name}
            </DialogTitle>
          </div>
          <div className="flex-1 overflow-hidden bg-gray-50 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading analytics...</p>
                </div>
              </div>
            )}
            <iframe
              src={`https://countik.com/tiktok-analytics/user/${creator.username}`}
              className="w-full h-full border-0"
              title={`Analytics for ${creator.name}`}
              loading="lazy"
              sandbox="allow-same-origin allow-scripts"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Creators() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    followerRange: 'All',
    engagementRate: [0, 100],
    priceRange: [0, 10000],
    countries: [],
    categories: [],
    languages: [],
    verified: false,
  })
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [totalCount, setTotalCount] = useState(0)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const creatorsPerPage = viewMode === 'grid' ? 30 : 60
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);  // Scroll to top when page changes
  };

  const fetchCreators = useCallback(async () => {
    try {
      const start = (currentPage - 1) * creatorsPerPage;
      const end = start + creatorsPerPage - 1;
      
      const selectedRange = followerRanges.find(r => r.label === filters.followerRange);
      const minFollowers = selectedRange?.min || 0;
      const maxFollowers = selectedRange?.max || null;

      // Create cache key
      const cacheKey = JSON.stringify({
        start,
        end,
        search: debouncedSearch,
        minFollowers,
        maxFollowers,
        sortDirection
      });

      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
        setCreators(cached.data.creators);
        setTotalCount(cached.data.totalCount);
        return;
      }

      setLoading(true);

      // Parallel fetching
      const [creatorsResponse, countResponse] = await Promise.all([
        supabase.rpc('fetch_tiktok_creators', {
          p_sort_direction: sortDirection,
          p_start: start,
          p_end: end,
          p_search: debouncedSearch || '',
          p_min_followers: minFollowers,
          p_max_followers: maxFollowers
        }),
        supabase.rpc('get_total_creators_count', {
          p_search: debouncedSearch || '',
          p_min_followers: minFollowers,
          p_max_followers: maxFollowers
        })
      ]);

      if (creatorsResponse.error) throw creatorsResponse.error;
      if (countResponse.error) throw countResponse.error;

      const fetchedCreators = creatorsResponse.data || [];
      const totalItems = countResponse.data?.[0]?.count || 0;

      // Update cache
      cache.set(cacheKey, {
        data: { creators: fetchedCreators, totalCount: totalItems },
        timestamp: Date.now()
      });

      setCreators(fetchedCreators);
      setTotalCount(totalItems);

    } catch (error) {
      console.error('Error fetching creators:', error);
      setCreators([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.followerRange, sortDirection, creatorsPerPage]);

  // Clear cache on unmount
  useEffect(() => {
    return () => {
      cache.clear();
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  // Handle search and filter changes
  useEffect(() => {
    if (!loading) {
      fetchCreators();
    }
  }, [debouncedSearch, currentPage, sortDirection, filters.followerRange, fetchCreators]);

  // Add this console log to verify state updates
  // useEffect(() => {
  //   console.log('Creators state updated:', creators)
  // }, [creators])

  // Update the pagination rendering
  const renderPaginationItems = () => {
    const totalPages = Math.ceil(totalCount / creatorsPerPage);
    
    // Only log if needed for debugging
    // console.log('Pagination details:', { 
    //   totalCount, 
    //   creatorsPerPage, 
    //   totalPages, 
    //   currentPage 
    // });
    
    if (totalPages <= 1) return null;

    const items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }

    // Numbered pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Add loading skeleton optimization
  const LoadingSkeleton = memo(() => (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        viewMode === 'grid' ? (
          <CreatorCardSkeleton key={index} />
        ) : (
          <CreatorListItemSkeleton key={index} />
        )
      ))}
    </>
  ));

  // Optimize the creators list rendering
  const CreatorsList = memo(({ creators, viewMode }: { 
    creators: Creator[]; 
    viewMode: 'grid' | 'list' 
  }) => (
    <>
      {creators.map((creator) => (
        viewMode === 'grid' ? (
          <CreatorCard key={creator.id} creator={creator} />
        ) : (
          <CreatorListItem key={creator.id} creator={creator} />
        )
      ))}
    </>
  ));

  return (
    <div className="p-6 relative z-0">
      {/* Header Section - Always visible */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Discover Creators</h1>
          <p className="text-gray-500 mt-1">
            Find and connect with creators that match your brand
          </p>
        </div>
        <Button className="text-white relative z-0">
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Saved Creators
        </Button>
      </div>

      {/* Platform Tabs - Always visible */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="instagram">
            <AiOutlineInstagram className="mr-2 h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="tiktok">
            <FaTiktok className="mr-2 h-4 w-4" />
            TikTok
          </TabsTrigger>
          <TabsTrigger value="youtube">
            <AiFillYoutube className="mr-2 h-4 w-4" />
            YouTube
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters Bar - Always visible */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search creators by name, username or category..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'text-white' : ''}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'text-white' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
              setCurrentPage(1) // Reset to first page when sorting changes
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Followers {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel - Always visible when showFilters is true */}
      {showFilters && (
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Follower Range</label>
              <Select
                value={filters.followerRange}
                onValueChange={(value) => {
                  setFilters(prev => ({
                    ...prev,
                    followerRange: value
                  }))
                  setCurrentPage(1) // Reset to first page when filter changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {followerRanges.map((range) => (
                    <SelectItem key={range.label} value={range.label}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Content Section */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }
      `}>
        {loading ? (
          <LoadingSkeleton />
        ) : creators.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No creators found matching your search criteria</p>
          </div>
        ) : (
          <CreatorsList creators={creators} viewMode={viewMode} />
        )}
      </div>

      {/* Pagination */}
      {!loading && creators.length > 0 && totalCount > creatorsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => {
                    const maxPage = Math.ceil(totalCount / creatorsPerPage);
                    if (currentPage < maxPage) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage >= Math.ceil(totalCount / creatorsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  const [showEmailViewer, setShowEmailViewer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowAnalytics(true);
  };

  const handleCardClick = async () => {
    try {
      const { data, error } = await supabase
        .from('tiktok')
        .select('profile')
        .eq('id', creator.id)
        .single();

      if (error) throw error;
      
      if (data?.profile) {
        window.open(data.profile, '_blank');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEmailReveal = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('tiktok')
        .select('email')
        .eq('id', creator.id)
        .single();

      if (error) {
        console.error('Supabase error:', error); // Debug log
        return null;
      }

      return data?.email || null;

    } catch (error) {
      console.error('Error revealing email:', error);
      return null;
    }
  };

  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Clickable Profile Section */}
        <a 
          href={`https://www.tiktok.com/@${creator.username}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative pt-12 px-4">
            <img
              src={creator.image || '/default-avatar.png'}
              alt={creator.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md mx-auto"
            />
          </div>
          <div className="text-center p-4 pb-2">
            <h3 className="font-bold">{creator.name}</h3>
            <p className="text-sm text-gray-500">{creator.username}</p>
          </div>
        </a>

        {/* Non-clickable Stats and Actions Section */}
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 gap-4 my-4">
            <Stat
              icon={<Users className="h-4 w-4" />}
              value={creator.followers}
              label="Followers"
            />
          </div>
          
          {/* Actions Container */}
          <div className="space-y-3">
            {/* Analytics Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 bg-[#fe2c55] text-white hover:bg-[#fe2c55]/90 transition-colors"
              onClick={handleAnalyticsClick}
            >
              View Analytics
            </Button>

            {/* Email Button Below */}
            {creator.has_email && (
              <div onClick={(e) => e.stopPropagation()} className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowEmailViewer(!showEmailViewer);
                  }}
                >
                  {showEmailViewer ? 'Hide Email' : 'View Email'}
                </Button>
                {showEmailViewer && (
                  <div 
                    className="mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EmailViewer 
                      email={creator.email}
                      preview="Click to reveal creator's email"
                      onReveal={handleEmailReveal}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <AnalyticsModal 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
        creator={creator} 
      />
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center text-gray-500 mb-1">
        {icon}
      </div>
      <div className="font-bold">
        {label === "Followers" ? formatFollowerCount(value) : value.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function CreatorListItem({ creator }: CreatorListItemProps) {
  const [showEmailViewer, setShowEmailViewer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAnalytics(true);
  };

  const handleCardClick = async () => {
    try {
      const { data, error } = await supabase
        .from('tiktok')
        .select('profile')
        .eq('id', creator.id)
        .single();

      if (error) throw error;
      
      if (data?.profile) {
        window.open(data.profile, '_blank');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEmailReveal = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('tiktok')
        .select('email')
        .eq('id', creator.id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return null;
      }

      return data?.email || null;

    } catch (error) {
      console.error('Error revealing email:', error);
      return null;
    }
  };

  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer relative"
        onClick={handleCardClick}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Creator Info - Left Side */}
            <div className="flex items-center space-x-4 w-1/3">
              <img
                src={creator.image || '/default-avatar.png'}
                alt={creator.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <h3 className="font-medium truncate">{creator.name}</h3>
                <p className="text-sm text-gray-500 truncate">@{creator.username}</p>
              </div>
            </div>

            {/* Followers - Middle */}
            <div className="flex items-center justify-center w-1/3 -ml-20">
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">{formatFollowerCount(creator.followers)}</span>
                <span className="text-sm text-gray-500">followers</span>
              </div>
            </div>

            {/* Actions - Right Side */}
            <div className="flex items-center justify-end gap-3 w-1/3">
              {creator.has_email && (
                <div 
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-9 min-w-[100px]"
                    onClick={() => setShowEmailViewer(!showEmailViewer)}
                  >
                    {showEmailViewer ? 'Hide Email' : 'View Email'}
                  </Button>
                  {showEmailViewer && (
                    <div 
                      className="absolute right-[110%] top-1/2 -translate-y-1/2 z-50 bg-white rounded-md shadow-lg border min-w-[250px] p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EmailViewer 
                        email={creator.email}
                        preview="Click to reveal creator's email"
                        onReveal={handleEmailReveal}
                        className="!p-0 !shadow-none !border-0 !bg-transparent [&_*]:text-sm [&_button]:h-8 [&_button]:text-xs" // Smaller text and buttons
                      />
                    </div>
                  )}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 min-w-[100px] bg-[#fe2c55] text-white hover:bg-[#fe2c55]/90"
                onClick={handleAnalyticsClick}
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AnalyticsModal 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
        creator={creator} 
      />
    </>
  );
}

// Add these skeleton components
function CreatorCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative pt-12 px-4">
        <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto" />
      </div>
      <div className="p-4">
        <div className="text-center space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
          <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
        </div>
        <div className="grid grid-cols-3 gap-4 my-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="h-4 w-4 bg-gray-200 rounded mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
              <div className="h-2 bg-gray-200 rounded w-10 mx-auto" />
            </div>
          ))}
        </div>
        <div className="h-8 bg-gray-200 rounded w-full mt-2" />
      </div>
    </Card>
  );
}

function CreatorListItemSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-[35%] flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <div className="w-[15%]">
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="w-[15%]">
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="w-[15%]">
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="w-[20%]">
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}

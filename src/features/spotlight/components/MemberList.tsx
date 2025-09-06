import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MemberSpotlight, PaginationState } from '../types';
import MemberCard from './MemberCard';

interface MemberListProps {
  members: MemberSpotlight[];
  pageSize?: number;
  enableVirtualization?: boolean;
}

const MemberList: React.FC<MemberListProps> = ({ 
  members, 
  pageSize = 12,
  enableVirtualization = false 
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize,
    totalPages: Math.ceil(members.length / pageSize)
  });

  // Auto-enable virtualization for large lists
  const shouldVirtualize = enableVirtualization || members.length > 48;

  const paginatedMembers = useMemo(() => {
    if (shouldVirtualize && members.length > 48) {
      // For very large lists, implement virtualization logic here
      // For now, using simple pagination
    }
    
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return members.slice(startIndex, endIndex);
  }, [members, pagination.currentPage, pagination.pageSize, shouldVirtualize]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(newPage, prev.totalPages))
    }));
    
    // Scroll to top of member list
    const listElement = document.getElementById('member-list');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showPagination = members.length > pageSize;

  return (
    <div className="space-y-8">
      <div 
        id="member-list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Member spotlight list"
      >
        {paginatedMembers.map((member, index) => (
          <div key={member.id} role="listitem">
            <MemberCard member={member} index={index} />
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="flex items-center justify-center gap-4" role="navigation" aria-label="Pagination">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-2"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <span className="text-xs text-muted-foreground">
              ({members.length} total members)
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-2"
            aria-label="Go to next page"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(MemberList);
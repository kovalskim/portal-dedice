import { SortOrder } from '@backend/modules/proceedings/graphql/types/GetAllProceedingsArgs';

export type FindAllProceedingArgsDTO = {
  currentPage: number;
  pageSize: number;
  sortOrder: SortOrder;
  filterProceedingNumber?: string;
  filterDeceasedName?: string;
  filterStartDate?: string;
  filterPhaseId?: number;
  filterStatus?: string;
};

import { SortOrder } from '@backend/graphql/modules/proceedings/GetAllProceedingsArgs';

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

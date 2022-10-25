import { PartialType, OmitType} from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";
export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['category'] as const),
) {}

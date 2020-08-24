import { SuperMarketAddress } from "./super-market-address";

export interface SuperMarket {
	_id: string;
	superMarketName: string;
	superMarketMainImage: string;
	superMarketAdditionalImages: string[];
	superMarketAddress: SuperMarketAddress;
	superMarketDescription: string;
	superMarketPhone: string;
}

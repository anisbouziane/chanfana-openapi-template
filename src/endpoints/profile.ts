import { contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../types";
import { z } from "zod";

export class ProfileEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Profile"],
		summary: "Fetch the current user profile",
		operationId: "get-profile",
		responses: {
			"200": {
				description: "Returns the current user profile",
				...contentJson({
					success: Boolean,
					result: z.object({
						id: z.number().int(),
						name: z.string(),
						email: z.string().email(),
						role: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(_c: AppContext) {
		return {
			success: true,
			result: {
				id: 1,
				name: "Jane Doe",
				email: "jane.doe@example.com",
				role: "user",
			},
		};
	}
}

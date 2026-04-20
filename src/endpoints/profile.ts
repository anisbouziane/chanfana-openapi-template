import { ApiException, contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../types";
import { z } from "zod";

const PROFILE_SERVICE_URL = "https://api.agify.io/?name=";

export class ProfileEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Profile"],
		summary: "Fetch the current user profile from an upstream service",
		operationId: "get-profile",
		request: {
			query: z.object({
				name: z.string(),
			}),
		},
		responses: {
			"200": {
				description: "Returns the current user profile",
				...contentJson({
					success: Boolean,
					result: z.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().email().optional(),
						role: z.string().optional(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const nameParam = data.query?.name;

		if (!nameParam) {
			throw new ApiException(400, "The query parameter 'name' is required.");
		}

		const url = `${PROFILE_SERVICE_URL}${encodeURIComponent(nameParam)}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Unable to fetch profile: ${response.status} ${response.statusText}`);
		}

		const result = await response.json();

		return {
			success: true,
			result,
		};
	}
}

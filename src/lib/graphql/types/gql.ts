/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    mutation registerBroadcaster($input: RegisterBroadcasterInput!) {\n        registerBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street\n            }\n          }\n        }\n    }\n": typeof types.RegisterBroadcasterDocument,
    "\n    mutation registerClient($input: RegisterClientInput!) {\n        registerClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n": typeof types.RegisterClientDocument,
    "\n    mutation googleAuth($code: String!) {\n        googleAuth(input: { code: $code }) {\n            token\n            requiresRegistration\n            subject\n            email\n            firstName\n            lastName\n        }\n    }\n": typeof types.GoogleAuthDocument,
    "\n  mutation login($input: UserLoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        userId\n        email\n        firstName\n        lastName\n        __typename\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n    mutation completeGoogleSignUpBroadcaster($input: CompleteGoogleSignUpBroadcasterInput!) {\n        completeGoogleSignUpBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              }\n              street,\n              city,\n              state,\n            }\n          }\n        }\n    }\n": typeof types.CompleteGoogleSignUpBroadcasterDocument,
    "\n    mutation completeGoogleSignUpClient($input: CompleteGoogleSignUpClientInput!) {\n        completeGoogleSignUpClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              street,\n              city,\n              state,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n": typeof types.CompleteGoogleSignUpClientDocument,
    "\n    query countries {\n        countries {\n          countryCode\n          name\n        }\n    }\n": typeof types.CountriesDocument,
    "\n    query departments($countryCode: String!) {\n        departments(where: {countryCode: {eq: $countryCode}}) {\n          departmentId\n          name\n        }\n    }\n": typeof types.DepartmentsDocument,
    "\n    query services {\n        services {\n          serviceId,\n          name,\n          __typename\n          ... on ServiceDuration {\n            servicePrices(order: {durationId: DESC}) {\n                durationId\n                price\n                variantPrice\n                }\n            }\n          ... on ServiceSpecial {\n                price\n            }\n          ... on ServiceIVR {\n                initialMessagePrice\n            }\n          ... on ServiceNarrative {\n                basePrice\n                extraPrice\n            }\n        }\n    }\n": typeof types.ServicesDocument,
    "\n  mutation CalculateContract($input: CalculateContractInput!) {\n    calculateContract(input: $input) {\n      totalPrice\n      servicePrice {\n        service\n        price\n        totalPriceWithDiscount\n        variants\n        pieceName\n        serviceFlags {\n          isOn\n          label\n        }\n      }\n    }\n  }\n": typeof types.CalculateContractDocument,
};
const documents: Documents = {
    "\n    mutation registerBroadcaster($input: RegisterBroadcasterInput!) {\n        registerBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street\n            }\n          }\n        }\n    }\n": types.RegisterBroadcasterDocument,
    "\n    mutation registerClient($input: RegisterClientInput!) {\n        registerClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n": types.RegisterClientDocument,
    "\n    mutation googleAuth($code: String!) {\n        googleAuth(input: { code: $code }) {\n            token\n            requiresRegistration\n            subject\n            email\n            firstName\n            lastName\n        }\n    }\n": types.GoogleAuthDocument,
    "\n  mutation login($input: UserLoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        userId\n        email\n        firstName\n        lastName\n        __typename\n      }\n    }\n  }\n": types.LoginDocument,
    "\n    mutation completeGoogleSignUpBroadcaster($input: CompleteGoogleSignUpBroadcasterInput!) {\n        completeGoogleSignUpBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              }\n              street,\n              city,\n              state,\n            }\n          }\n        }\n    }\n": types.CompleteGoogleSignUpBroadcasterDocument,
    "\n    mutation completeGoogleSignUpClient($input: CompleteGoogleSignUpClientInput!) {\n        completeGoogleSignUpClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              street,\n              city,\n              state,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n": types.CompleteGoogleSignUpClientDocument,
    "\n    query countries {\n        countries {\n          countryCode\n          name\n        }\n    }\n": types.CountriesDocument,
    "\n    query departments($countryCode: String!) {\n        departments(where: {countryCode: {eq: $countryCode}}) {\n          departmentId\n          name\n        }\n    }\n": types.DepartmentsDocument,
    "\n    query services {\n        services {\n          serviceId,\n          name,\n          __typename\n          ... on ServiceDuration {\n            servicePrices(order: {durationId: DESC}) {\n                durationId\n                price\n                variantPrice\n                }\n            }\n          ... on ServiceSpecial {\n                price\n            }\n          ... on ServiceIVR {\n                initialMessagePrice\n            }\n          ... on ServiceNarrative {\n                basePrice\n                extraPrice\n            }\n        }\n    }\n": types.ServicesDocument,
    "\n  mutation CalculateContract($input: CalculateContractInput!) {\n    calculateContract(input: $input) {\n      totalPrice\n      servicePrice {\n        service\n        price\n        totalPriceWithDiscount\n        variants\n        pieceName\n        serviceFlags {\n          isOn\n          label\n        }\n      }\n    }\n  }\n": types.CalculateContractDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation registerBroadcaster($input: RegisterBroadcasterInput!) {\n        registerBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street\n            }\n          }\n        }\n    }\n"): (typeof documents)["\n    mutation registerBroadcaster($input: RegisterBroadcasterInput!) {\n        registerBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street\n            }\n          }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation registerClient($input: RegisterClientInput!) {\n        registerClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n"): (typeof documents)["\n    mutation registerClient($input: RegisterClientInput!) {\n        registerClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              state,\n              city,\n              street,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation googleAuth($code: String!) {\n        googleAuth(input: { code: $code }) {\n            token\n            requiresRegistration\n            subject\n            email\n            firstName\n            lastName\n        }\n    }\n"): (typeof documents)["\n    mutation googleAuth($code: String!) {\n        googleAuth(input: { code: $code }) {\n            token\n            requiresRegistration\n            subject\n            email\n            firstName\n            lastName\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($input: UserLoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        userId\n        email\n        firstName\n        lastName\n        __typename\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($input: UserLoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        userId\n        email\n        firstName\n        lastName\n        __typename\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation completeGoogleSignUpBroadcaster($input: CompleteGoogleSignUpBroadcasterInput!) {\n        completeGoogleSignUpBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              }\n              street,\n              city,\n              state,\n            }\n          }\n        }\n    }\n"): (typeof documents)["\n    mutation completeGoogleSignUpBroadcaster($input: CompleteGoogleSignUpBroadcasterInput!) {\n        completeGoogleSignUpBroadcaster(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              }\n              street,\n              city,\n              state,\n            }\n          }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation completeGoogleSignUpClient($input: CompleteGoogleSignUpClientInput!) {\n        completeGoogleSignUpClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              street,\n              city,\n              state,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n"): (typeof documents)["\n    mutation completeGoogleSignUpClient($input: CompleteGoogleSignUpClientInput!) {\n        completeGoogleSignUpClient(input: $input) {\n          token,\n          user {\n            email,\n            firstName,\n            lastName,\n            rut,\n            address {\n              country {\n                countryCode,\n                name\n              },\n              street,\n              city,\n              state,\n            },\n            ... on Client {\n              agency {\n                name\n              }\n            }\n          }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query countries {\n        countries {\n          countryCode\n          name\n        }\n    }\n"): (typeof documents)["\n    query countries {\n        countries {\n          countryCode\n          name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query departments($countryCode: String!) {\n        departments(where: {countryCode: {eq: $countryCode}}) {\n          departmentId\n          name\n        }\n    }\n"): (typeof documents)["\n    query departments($countryCode: String!) {\n        departments(where: {countryCode: {eq: $countryCode}}) {\n          departmentId\n          name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query services {\n        services {\n          serviceId,\n          name,\n          __typename\n          ... on ServiceDuration {\n            servicePrices(order: {durationId: DESC}) {\n                durationId\n                price\n                variantPrice\n                }\n            }\n          ... on ServiceSpecial {\n                price\n            }\n          ... on ServiceIVR {\n                initialMessagePrice\n            }\n          ... on ServiceNarrative {\n                basePrice\n                extraPrice\n            }\n        }\n    }\n"): (typeof documents)["\n    query services {\n        services {\n          serviceId,\n          name,\n          __typename\n          ... on ServiceDuration {\n            servicePrices(order: {durationId: DESC}) {\n                durationId\n                price\n                variantPrice\n                }\n            }\n          ... on ServiceSpecial {\n                price\n            }\n          ... on ServiceIVR {\n                initialMessagePrice\n            }\n          ... on ServiceNarrative {\n                basePrice\n                extraPrice\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CalculateContract($input: CalculateContractInput!) {\n    calculateContract(input: $input) {\n      totalPrice\n      servicePrice {\n        service\n        price\n        totalPriceWithDiscount\n        variants\n        pieceName\n        serviceFlags {\n          isOn\n          label\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CalculateContract($input: CalculateContractInput!) {\n    calculateContract(input: $input) {\n      totalPrice\n      servicePrice {\n        service\n        price\n        totalPriceWithDiscount\n        variants\n        pieceName\n        serviceFlags {\n          isOn\n          label\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
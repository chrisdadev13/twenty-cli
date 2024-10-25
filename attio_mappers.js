function parseEmployeeRange(range) {
  if (range === "100K+") return 100000;
  return 0;
}

function parseAnnualRevenue(revenue) {
  if (revenue === "$10B+") return 10000000000 * 1000000;
  return 0;
}

export function mapAttioCompanyData(sourceData) {
  return sourceData.data.map((item) => {
    const values = item.values;

    return {
      name: String(values.name[0]?.value) || "",
      domainName: {
        primaryLinkLabel: values.domains[0]?.domain || "",
        primaryLinkUrl: `https://${values.domains[0]?.domain || ""}`,
        secondaryLinks: [],
      },
      employees: parseEmployeeRange(
        values.employee_range[0]?.option?.title || "",
      ),
      linkedinLink: {
        primaryLinkLabel: "LinkedIn",
        primaryLinkUrl: String(values.linkedin[0]?.value) || "",
        secondaryLinks: [],
      },
      xLink: {
        primaryLinkLabel: "X",
        primaryLinkUrl: String(values.twitter[0]?.value) || "",
        secondaryLinks: [],
      },
      annualRecurringRevenue: {
        amountMicros: parseAnnualRevenue(
          values.estimated_arr_usd[0]?.option?.title || "",
        ),
        currencyCode: "USD",
      },
      address: {
        addressStreet1: values.primary_location[0]?.line_1 || "",
        addressStreet2: values.primary_location[0]?.line_2 || "",
        addressCity: values.primary_location[0]?.locality || "",
        addressPostcode: values.primary_location[0]?.postcode || "",
        addressState: values.primary_location[0]?.region || "",
        addressCountry: values.primary_location[0]?.country_code || "",
        addressLat: parseFloat(values.primary_location[0]?.latitude || "0"),
        addressLng: parseFloat(values.primary_location[0]?.longitude || "0"),
      },
      idealCustomerProfile: true,
      position: 0,
      createdBy: {
        source: "API",
      },
    };
  });
}

export function mapAttioPersonData(sourceData) {
  return sourceData.data.map((record, index) => {
    const name = record.values.name[0];
    const email = record.values.email_addresses[0];
    const phone = record.values.phone_numbers?.[0];
    const location = record.values.primary_location?.[0];
    const jobTitle = record.values.job_title?.[0];
    const linkedin = record.values.linkedin?.[0];
    const twitter = record.values.twitter?.[0];

    const twentyPerson = {
      name: {
        firstName: name.first_name || "",
        lastName: name.last_name || "",
      },
      emails: {
        primaryEmail: email?.email_address || "",
      },
      position: index,
      createdBy: {
        source: "EMAIL",
      },
    };

    if (linkedin?.value) {
      twentyPerson.linkedinLink = {
        primaryLinkLabel: "LinkedIn",
        primaryLinkUrl: linkedin.value,
      };
    }

    if (twitter?.value) {
      twentyPerson.xLink = {
        primaryLinkLabel: "X",
        primaryLinkUrl: twitter.value,
      };
    }

    if (jobTitle?.value) {
      twentyPerson.jobTitle = jobTitle.value;
    }

    if (phone) {
      twentyPerson.phones = {
        primaryPhoneNumber: phone.phone_number || "",
        primaryPhoneCountryCode: phone.country_code || "",
      };
    }

    if (location?.locality) {
      twentyPerson.city = location.locality;
    }

    return twentyPerson;
  });
}

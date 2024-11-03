import { Flex } from '@chakra-ui/react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useFormContext } from 'react-hook-form';

import { InputField } from '@frontend/components';
import { config } from '@frontend/config.ts';

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type AddressObject = {
  street: string;
  premise: string;
  streetWithNumber: string;
  city: string;
  district: string;
  postalCode: string;
};

type Place = {
  address_components: AddressComponent[];
};

const extractAddressComponents = (components: AddressComponent[]) => {
  const addressObj: AddressObject = {
    street: '',
    premise: '',
    streetWithNumber: '',
    city: '',
    district: '',
    postalCode: '',
  };
  components.forEach((component) => {
    const types = component.types;
    if (types.includes('route')) {
      addressObj.street = component.long_name;
    }
    if (types.includes('premise')) {
      addressObj.premise = component.long_name;
    }
    if (types.includes('street_number')) {
      addressObj.streetWithNumber = component.long_name;
    }
    // primárně sublocality (např. Praha 14), případně pokud není, tak neighborhood (např. Klatovy IV)
    if (types.includes('sublocality')) {
      addressObj.city = component.long_name;
    }
    if (types.includes('neighborhood') && !addressObj.city) {
      addressObj.city = component.long_name;
    }
    if (types.includes('locality') && !addressObj.city) {
      addressObj.city = component.long_name;
    }
    if (types.includes('administrative_area_level_2')) {
      addressObj.district = component.long_name;
    }
    if (types.includes('postal_code')) {
      addressObj.postalCode = component.long_name;
    }
  });

  // Pro Prahu jako výjimku vrací PlacesAPI město a městskou část/okres obráceně než je potřeba
  if (addressObj.district === 'Hlavní město Praha') {
    addressObj.district = addressObj.city;
    addressObj.city = 'Praha';
  }

  return addressObj;
};

export const AutocompleteAddress = () => {
  const { setValue } = useFormContext();

  const handleAddressSelected = (place: Place) => {
    const addressObj = extractAddressComponents(place.address_components);

    setValue(
      'streetWithNumber',
      `${addressObj.street} ${addressObj.premise}${addressObj.premise && addressObj.streetWithNumber && '/'}${addressObj.streetWithNumber}`,
    );
    setValue('city', addressObj.city);
    setValue('district', addressObj.district);
    setValue('postalCode', addressObj.postalCode);
  };

  const { ref } = usePlacesWidget({
    apiKey: config.GOOGLE_API_KEY,
    onPlaceSelected: handleAddressSelected,
    options: {
      types: ['geocode'],
      componentRestrictions: { country: 'cz' },
    },
  });

  return (
    <>
      <Flex
        direction={{
          base: 'column',
          md: 'row',
        }}
        gap="5"
        mb="6"
      >
        <InputField
          name="streetWithNumber"
          label="Ulice a číslo popisné"
          placeholder="Zadejte ulici a číslo popisné"
          ref={ref}
        />
        <InputField name="city" label="Obec" placeholder="Zadejte obec" />
      </Flex>
      <Flex
        direction={{
          base: 'column',
          md: 'row',
        }}
        gap="5"
        mb="6"
      >
        <InputField
          name="district"
          label="Okres (městská část pro Prahu)"
          placeholder="Zadejte okres (městská část pro Prahu)"
        />
        <InputField name="postalCode" label="PSČ" placeholder="Zadejte PSČ" />
      </Flex>
    </>
  );
};

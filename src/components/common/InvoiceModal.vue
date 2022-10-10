<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, reactive, ref, type Ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import type {
  InvoiceInterface,
  ItemsList,
  Address,
  Error,
  SyntheticEventTarget
} from "./InvoiceInterface";
import { format, add } from "date-fns";
import type { AxiosResponse } from "axios";
import axios from "axios";

/**
 * showAddModal will open the create Invoice modal
 */
const props = defineProps<{
  invoiceData?: InvoiceInterface;
  showModal: boolean;
}>();

/**
 * emit will hold the parent methods that can emit from child
 */
const emit = defineEmits(["hideAddModal", "getInvoice", "fetchInvoices"]);

/**
 * defaultValues will have default Invoice modal
 */
const defaultValues: InvoiceInterface = {
  id: "",
  paymentDue: format(add(new Date(), { days: 1 }), "yyyy-MM-dd"),
  clientName: "",
  total: 0,
  status: "",
  clientEmail: "",
  senderAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  clientAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  items: [
    {
      name: "",
      price: 0,
      quantity: 0,
      total: 0,
    },
  ],
  paymentTerms: 1,
  description: "",
  createdAt: "",
};

/**
 * errorObj default odject
 */
const errorObj: Error = {
  error: false,
  errorMsg: "",
};

/**
 * invoiceObjData will create new Invoice instance
 */
let invoiceObjData: InvoiceInterface = reactive(defaultValues);
/**
 * showErrMsg will be used to show error message while form validation
 */
let showErrMsg: Error = reactive(errorObj);
/**
 * open will open the create showModal ref for Invoice modal
 */
let open: Ref<boolean> = ref(props.showModal);

/**
 * onBeforeMount is a hook that's triggers before component mounts
 */
onBeforeMount(() => {
  if (props.invoiceData) {
    const {
      id,
      paymentDue,
      clientName,
      clientEmail,
      paymentTerms,
      description,
      items,
      clientAddress,
      senderAddress,
      createdAt,
      status,
      total,
    } = props.invoiceData;
    invoiceObjData.id = id;
    invoiceObjData.paymentDue = paymentDue?.length > 0 ? format(new Date(paymentDue), "yyyy-MM-dd") : paymentDue;
    invoiceObjData.clientName = clientName;
    invoiceObjData.clientEmail = clientEmail;
    invoiceObjData.paymentTerms = paymentTerms;
    invoiceObjData.description = description;
    invoiceObjData.items = items;
    invoiceObjData.clientAddress = clientAddress;
    invoiceObjData.senderAddress = senderAddress;
    invoiceObjData.createdAt = createdAt;
    invoiceObjData.status = status;
    invoiceObjData.total = total;
  }
  open.value = props.showModal;
});

/**
 * onBeforeUnmount is a hook that's triggers before component unmounts
 */
onBeforeUnmount(() => {
  const {
    id,
    paymentDue,
    clientName,
    clientEmail,
    paymentTerms,
    description,
    items,
    clientAddress,
    senderAddress,
    createdAt,
    status,
    total,
  } = defaultValues;
  invoiceObjData.id = id;
  invoiceObjData.paymentDue = paymentDue;
  invoiceObjData.clientName = clientName;
  invoiceObjData.clientEmail = clientEmail;
  invoiceObjData.paymentTerms = paymentTerms;
  invoiceObjData.description = description;
  invoiceObjData.items = items;
  invoiceObjData.clientAddress = clientAddress;
  invoiceObjData.senderAddress = senderAddress;
  invoiceObjData.createdAt = createdAt;
  invoiceObjData.status = status;
  invoiceObjData.total = total;
});

/**
 * closeModal will emit to close create Invoice modal
 */
const closeModal = (): void => {
  invoiceObjData = { ...defaultValues };
  emit("hideAddModal");
};

/**
 * randomString will create random string for an Invoice id
 * @param len is the max length of random string
 * @param charSet is the custom charactors set used to generate random string
 */
const randomString = (len: number, charSet?: string): string => {
  charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

/**
 * randomIdGenerator will generate random Id for an Invoice
 */
const randomIdGenerator = (): string => {
  const randomNum = Math.round(Math.random() * 10000);
  const randomStr = randomString(2);
  return `${randomStr}${randomNum}`;
};

/**
 * saveAsDraft Invoice as draft
 */
const saveAsDraft = (): void => {
  const { id } = invoiceObjData;
  if (!id) {
    const newId: string = randomIdGenerator();
    invoiceObjData.id = newId;
  }
  invoiceObjData.status = "draft";
  saveInvoice(invoiceObjData);
};

/**
 * checkAllFields will validate address fields in the form
 */
const checkAllFields = (addressFields: Address): boolean => {
  if (
    !addressFields?.city ||
    !addressFields?.country ||
    !addressFields?.postCode ||
    !addressFields?.street
  ) {
    return false;
  }
  return true;
};

/**
 * saveForm will validate & save the form
 */
const saveForm = (): void => {
  const {
    id,
    paymentDue,
    clientName,
    clientEmail,
    paymentTerms,
    description,
    items,
    clientAddress,
    senderAddress,
  } = invoiceObjData;

  if (
    !paymentDue ||
    !clientName ||
    !clientName ||
    !paymentTerms ||
    !description ||
    !clientEmail
  ) {
    showErrMsg.error = true;
    showErrMsg.errorMsg = "All fields are required";
    return;
  }
  const clientAddrField = checkAllFields(clientAddress);
  const senderAddrField = checkAllFields(senderAddress);
  let isItemsValid: boolean = true;
  let itemsTotalVal: number = 0;
  if (items?.length > 0) {
    items.forEach((item: ItemsList): void => {
      if (!item?.name || !item.price || !item.quantity || !item.total) {
        isItemsValid = false;
      } else if (item?.total) {
        itemsTotalVal += item.total;
      }
    });
  }

  if (!clientAddrField || !senderAddrField || !isItemsValid) {
    showErrMsg.error = true;
    showErrMsg.errorMsg = "All fields are required";
    return;
  }

  invoiceObjData.total = itemsTotalVal;
  invoiceObjData.createdAt = format(new Date(), "yyyy-MM-dd");
  showErrMsg.error = false;
  showErrMsg.errorMsg = "";
  if (!id) {
    const newId = randomIdGenerator();
    invoiceObjData.id = newId;
  }

  invoiceObjData.status = "pending";
  saveInvoice(invoiceObjData);
};

/**
 * saveInvoice will save/update an Invoice on click submit buttom
 * @param invoiceObj is the Invoice object to save/update
 */
const saveInvoice = async (invoiceObj: InvoiceInterface): Promise<void> => {
  try {
    const response: AxiosResponse<any, any> = await axios({
      method: props.invoiceData?.id ? "PUT" : "POST",
      url: `http://localhost:3000/invoices${
        props.invoiceData?.id ? "/" + props.invoiceData.id : ""
      }`,
      data: invoiceObj,
    });
    if (response.status === 201 || response.status === 200) {
      emit("hideAddModal");
    }
    if (props.invoiceData?.id) {
      emit("getInvoice", props.invoiceData.id);
    } else {
      emit("fetchInvoices");
    }
  } catch (error: any) {
    showErrMsg.error = true;
    showErrMsg.errorMsg = error.response.statusText;
  }
};

/**
 * addNewRow will add new item in Invoice items list
 */
const addNewRow = (): void => {
  const newRow: ItemsList = {
    name: "",
    price: 0,
    quantity: 0,
    total: 0,
  };
  invoiceObjData.items.push(newRow);
};

/**
 * removeRow will remove an Item from the Invoice items list
 * @param indx is current index to remove from list
 */
const removeRow = (indx: number): void => {
  if (invoiceObjData.items.length > 1) {
    invoiceObjData.items = invoiceObjData.items.filter((item: ItemsList, index: number): ItemsList | undefined => {
      if(index !== indx) {
        return item
      }
    });

  }
};

/**
 * changePaymentTerms will be triggred on change of payment tems & will also change payment due
 * @param event is the change event to capture the value onchange
 */
const changePaymentTerms = (event: Event): void => {
  const { value } = event.target as SyntheticEventTarget<number>;
  invoiceObjData.paymentTerms = value;
  invoiceObjData.paymentDue = format(
    add(new Date(), { days: value }),
    "yyyy-MM-dd"
  );
};
</script>
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity side-panel-bg"
        />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-x-0 left-0 flex max-w-full pl-10 side-panel-container"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto relative w-screen w-50">
                <div
                  class="flex h-full flex-col pb-2 bg-white py-6 shadow-xl side-panel-content-div"
                >
                  <form
                    class="add-form h-full"
                    ref="formRef"
                    @submit.prevent="saveForm"
                  >
                    <div class="px-4 sm:px-6">
                      <h1>
                        <span
                          v-if="invoiceObjData?.id === ''"
                          class="text-white fw-500"
                          >New Invoice</span
                        >
                        <span
                          v-if="invoiceObjData?.id !== ''"
                          class="text-white fw-500"
                          >Edit <span class="text-purple">#</span
                          >{{ invoiceData?.id }}</span
                        >
                      </h1>
                      <div v-if="showErrMsg?.error" class="error">
                        {{ showErrMsg?.errorMsg }}
                      </div>
                    </div>
                    <div
                      class="relative mt-6 px-4 sm:px-6 mt-4 overflow-y-scroll panel-form-div"
                    >
                      <div class="text-purple">Bill from</div>
                      <div class="col-span-6 mt-3">
                        <label
                          for="street-address"
                          class="block text-sm font-medium"
                          >Street address</label
                        >
                        <input
                          type="text"
                          name="senderAddressStreet"
                          id="street-address"
                          autocomplete="street-address"
                          class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          v-model.trim.lazy="
                            invoiceObjData.senderAddress.street
                          "
                        />
                      </div>
                      <div class="address-div mt-3">
                        <div class="" style="flex-grow: 1">
                          <label for="city" class="block text-sm font-medium"
                            >City</label
                          >
                          <input
                            type="text"
                            name="city"
                            id="city"
                            autocomplete="address-level2"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="
                              invoiceObjData.senderAddress.city
                            "
                          />
                        </div>

                        <div class="ml-2 mr-2" style="flex-grow: 1">
                          <label
                            for="postal-code"
                            class="block text-sm font-medium"
                            >Postal Code</label
                          >
                          <input
                            type="text"
                            name="postal-code"
                            id="postal-code"
                            autocomplete="postal-code"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="
                              invoiceObjData.senderAddress.postCode
                            "
                          />
                        </div>

                        <div class="" style="flex-grow: 1">
                          <label class="block text-sm font-medium" for="region"
                            >Country</label
                          >
                          <input
                            type="text"
                            name="region"
                            id="region"
                            autocomplete="address-level1"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="
                              invoiceObjData.senderAddress.country
                            "
                          />
                        </div>
                      </div>
                      <div class="mt-3 text-purple">Bill to</div>
                      <div class="col-span-2 mt-3">
                        <label
                          for="clientName"
                          class="block text-sm font-medium"
                          >Client's Name</label
                        >
                        <input
                          type="text"
                          name="clientName"
                          id="client-name"
                          autocomplete="name"
                          class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          v-model.trim.lazy="invoiceObjData.clientName"
                        />
                      </div>
                      <div class="col-span-2 mt-3">
                        <label
                          for="clientEmail"
                          class="block text-sm font-medium"
                          >Client's Email</label
                        >
                        <input
                          type="email"
                          name="clientEmail"
                          id="client-email"
                          autocomplete="email"
                          class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          v-model.trim.lazy="invoiceObjData.clientEmail"
                        />
                      </div>

                      <div class="col-span-6 mt-3">
                        <label
                          for="street-address"
                          class="block text-sm font-medium"
                          >Street address</label
                        >
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autocomplete="street-address"
                          class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          v-model.trim.lazy="
                            invoiceObjData.clientAddress.street
                          "
                        />
                      </div>
                      <div class="address-div mt-3">
                        <div class="" style="flex-grow: 1">
                          <label for="city" class="block text-sm font-medium"
                            >City</label
                          >
                          <input
                            type="text"
                            name="city"
                            id="city"
                            autocomplete="address-level2"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="
                              invoiceObjData.clientAddress.city
                            "
                          />
                        </div>

                        <div class="ml-2 mr-2" style="flex-grow: 1">
                          <label
                            for="postal-code"
                            class="block text-sm font-medium"
                            >Postal Code</label
                          >
                          <input
                            type="text"
                            name="postal-code"
                            id="postal-code"
                            autocomplete="postal-code"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="
                              invoiceObjData.clientAddress.postCode
                            "
                          />
                        </div>

                        <div class="" style="flex-grow: 1">
                          <label class="block text-sm font-medium" for="region"
                            >Country</label
                          >
                          <input
                            type="text"
                            name="region"
                            id="region"
                            autocomplete="address-level1"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="
                              invoiceObjData.clientAddress.country
                            "
                          />
                        </div>
                      </div>

                      <div class="address-div mt-3">
                        <div class="" style="flex-grow: 5">
                          <label
                            for="issueDate"
                            class="block text-sm font-medium"
                            >Issue Date</label
                          >
                          <input
                            type="date"
                            name="issueDate"
                            id="issue-date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            v-model.trim.lazy="invoiceObjData.paymentDue"
                            disabled
                          />
                        </div>
                        <div class="ml-2 mr-2" style="flex-grow: 5">
                          <label
                            for="paymentTerms"
                            class="block text-sm font-medium"
                            >Payment Tearms</label
                          >
                          <select
                            name="paymentTerms"
                            class="payment-terms mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            v-model.number.trim.lazy="
                              invoiceObjData.paymentTerms
                            "
                            @change="changePaymentTerms"
                          >
                            <option value="">Filter by status</option>
                            <option value="1">Next Day</option>
                            <option value="7">Next 7 Days</option>
                            <option value="14">Next 14 Days</option>
                            <option value="30">Next 30 Days</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-span-6 mt-3">
                        <label
                          for="projectDescription"
                          class="block text-sm font-medium"
                          >Project Description</label
                        >
                        <input
                          type="text"
                          name="projectDescription"
                          id="project-description"
                          class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          v-model.trim.lazy="invoiceObjData.description"
                        />
                      </div>
                      <div class="mt-3">Item List</div>
                      <div>
                        <table class="pb-3">
                          <tr>
                            <th class="text-wite-mute">Item Name</th>
                            <th class="text-wite-mute">Quantity</th>
                            <th class="text-wite-mute">Price</th>
                            <th class="text-wite-mute">Total</th>
                            <th></th>
                          </tr>
                          <tr v-for="(item, index) in invoiceObjData.items">
                            <td class="pl-0">
                              <input
                                type="text"
                                name="itemName"
                                id="item-name"
                                class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                v-model.trim.lazy="item.name"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="itemQuantity"
                                id="item-quantity"
                                class="mt-1 ml-1 mr-2 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                v-model.number.trim.lazy="item.quantity"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="item-price"
                                id="item-price"
                                class="mt-1 ml-1 mr-2 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                v-model.number.trim.lazy="item.price"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="itemTotal"
                                id="item-toatal"
                                class="mt-1 ml-1 mr-2 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                v-model.number.trim.lazy="item.total"
                              />
                            </td>
                            <td>
                              <TrashIcon
                                class="h-6 w-6 text-gray-600 ml-1"
                                aria-hidden="true"
                                @click.stop="removeRow(index)"
                              />
                            </td>
                          </tr>
                        </table>
                        <button
                          type="button"
                          class="add-item-btn mt-3 p-3 br-4 fw-700 rounded-md border text-sm font-medium leading-4"
                          @click.stop="addNewRow"
                        >
                          + Add New Item
                        </button>
                      </div>
                    </div>
                    <div class="absolute bottom-0 panel-footer">
                      <div
                        v-if="invoiceObjData?.id === ''"
                        class="d-flex w-full"
                      >
                        <div class="" style="flex-grow: 2">
                          <button
                            type="button"
                            class="rounded-md close-btn focus:outline-none focus:ring-2 focus:ring-white"
                            @click.stop="closeModal"
                          >
                            <span>Discard</span>
                          </button>
                        </div>
                        <div class="" style="flex-grow: 4"></div>
                        <div class="text-end" style="flex-grow: 2">
                          <button
                            type="button"
                            class="rounded-md save-draft-btn hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            @click.stop="saveAsDraft"
                          >
                            <span>Save as Draft</span>
                          </button>
                        </div>
                        <div class="text-end" style="flex-grow: 2">
                          <button
                            type="submit"
                            class="rounded-md add-invoice-btn hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          >
                            <span>Save & Send</span>
                          </button>
                        </div>
                      </div>
                      <div
                        v-if="invoiceObjData?.id !== ''"
                        class="d-flex w-full"
                      >
                        <div class="" style="flex-grow: 8"></div>
                        <div class="text-end" style="flex-grow: 1">
                          <button
                            type="button"
                            class="rounded-md save-cancel-btn hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            @click.stop="closeModal"
                          >
                            <span>Canclel</span>
                          </button>
                        </div>
                        <div class="text-end" style="flex-grow: 1">
                          <button
                            type="submit"
                            class="rounded-md add-invoice-btn hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          >
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.side-panel-bg {
  background-color: #14162591;
}
.inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 65px;
}
.side-panel-container {
  left: 25px;
}
.side-panel-content-div {
  background-color: #141625;
  overflow-y: auto;
  min-height: 100vh;
}

.address-div {
  display: flex;
}

.panel-form-div {
  height: 80vh;
  padding-bottom: 3rem;
}

.panel-footer {
  background-color: #141625;
  width: 95%;
  padding: 1rem;
  display: flex;
  padding-left: 1.75rem;
}

td {
  padding: 0rem 0.5rem;
}

.pl-0 {
  padding-left: 0rem;
}

.add-item-btn {
  border-radius: 1rem;
  color: var(--color-heading);
  background-color: #252945;
  border-color: #141625;
  padding: 0.75rem;
  width: 97%;
}

.close-btn {
  border-radius: 1rem;
  color: #000;
  background-color: var(--color-heading);
  padding: 0.75rem;
}

.save-draft-btn {
  border-radius: 1rem;
  color: #f8f8f8;
  background-color: #54545457;
  padding: 0.75rem;
}

.error {
  color: red;
}

.payment-terms {
  background-color: #252945;
  color: var(--color-heading);
  border: none;
}

.save-cancel-btn {
  border-radius: 1rem;
  color: #ebebeba3;
  background-color: #54545457;
  padding: 0.75rem;
}
</style>

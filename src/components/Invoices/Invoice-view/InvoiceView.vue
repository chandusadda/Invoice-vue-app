<script lang="ts">
import type { InvoiceProps } from "../../common/InvoiceInterface";
import router from "@/router";
import axios, { type AxiosResponse } from "axios";
import { defineComponent } from "vue";
import ModalView from "../../common/InvoiceModal.vue";
import DeleteModalView from "../../common/modalView.vue";
import { format } from "date-fns";

export default defineComponent({
  /**
   * components will hold the child components decorators
   */
  components: {
    ModalView,
    DeleteModalView,
  },
  /**
   * data will hold the complete componet state
   */
  data: (): InvoiceProps => {
    return {
      invoiceData: {
        id: "",
        paymentDue: "",
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
      },
      id: "",
      showModal: false,
      showDeleteModal: false,
    };
  },
  /**
   * Address will hold the Address of invoice interface
   */
  created(): void {
    this.id = this.$route?.params?.id;
    this.getInvoice(this.id);
  },
  /**
   * methods will all components functions
   */
  methods: {
    /**
     * getInvoice will get the an Invoice from an API
     * @param invoiceId is the id of an Invoice
     */
    async getInvoice(invoiceId: string | string[]): Promise<void> {
      try {
        const res: AxiosResponse<any, any> = await axios.get(
          `http://localhost:3000/invoices/${invoiceId}`
        );
        if (res.status === 200) {
          res.data.paymentDue = res?.data?.paymentDue
            ? format(new Date(res.data.paymentDue), "dd MMM yyyy")
            : res.data.paymentDue;
          res.data.createdAt = res?.data?.createdAt
            ? format(new Date(res.data.createdAt), "dd MMM yyyy")
            : res.data.createdAt;

          this.invoiceData = res.data;
        }
      } catch (error) {
        //just to read error occured
        console.error(error);
      }
    },
    /**
     * goToInvoices will go back to Invoices page
     */
    goToInvoices(): void {
      router.push({ path: `/` });
    },
    /**
     * deleteInvoiceById will hold delete an Invoice by its ID
     */
    async deleteInvoiceById(): Promise<void> {
      this.showDeleteModal = false;
      try {
        const response: AxiosResponse<any, any> = await axios.delete(
          `http://localhost:3000/invoices/${this.invoiceData.id}`
        );
        if (response.status === 200) {
          router.push({ path: `/` });
        }
      } catch (error) {
        //just to read error occured
        console.error(error);
      }
    },
    /**
     * deleteInvoice will call delete confirmation modal
     */
    deleteInvoice(): void {
      if (this.invoiceData.id) {
        this.showDeleteModal = true;
      }
    },
    /**
     * hideAddModal will hide edit invoice modal
     */
    hideAddModal(): void {
      this.showModal = false;
    },
    /**
     * editInvoice will show edit invoice modal
     */
    editInvoice(): void {
      this.showModal = true;
    },
    /**
     * hideDeleteModal will hide delete invoice modal
     */
    hideDeleteModal(): void {
      this.showDeleteModal = false;
    },
    /**
     * markAsPaid will save invoice as paid
     */
    async markAsPaid(): Promise<void> {
      if (this.invoiceData.status === "paid") {
        return;
      }
      this.invoiceData.status = "paid";
      try {
        const response: AxiosResponse<any, any> = await axios({
          method: "PUT",
          url: `http://localhost:3000/invoices/${this.invoiceData.id}`,
          data: this.invoiceData,
        });
        if (response.status === 200) {
          router.push({ path: `/` });
        }
      } catch (error) {
        //just to read error occured
        console.error(error);
      }
    },
  },
});
</script>

<template>
  <main>
    <div class="invoice-view-main-div invoices-list">
      <div class="invoice-card-main-div mt-5">
        <div class="m-3 mb-4" @click.stop="goToInvoices">
          <img
            class="display-inline mr-3"
            alt="icon right"
            src="@/assets/images/icon-arrow-left.svg"
          />
          <button
            type="button"
            class="invoice-back-btn color-draft rounded-md border text-sm font-medium leading-4 text-gray-700"
          >
            go back
          </button>
        </div>
        <div class="invoice-card-div mb-4">
          <div style="flex-grow: 1" class="text-left mt-2">
            <span class="mr-3 text-wite-mute">Status</span>
            <button
              type="button"
              class="invoice-status-btn rounded-md border text-sm font-medium leading-4 text-gray-700"
              :class="{
                'color-draft':
                  invoiceData.status && invoiceData.status === 'draft',
                'color-paid':
                  invoiceData.status && invoiceData.status === 'paid',
                'color-pending':
                  invoiceData.status && invoiceData.status === 'pending',
              }"
            >
              <span class="invoice-status-btn-dot">.</span>
              {{ invoiceData.status }}
            </button>
          </div>
          <div style="flex-grow: 3"></div>
          <div style="flex-grow: 3" class="text-end">
            <button
              type="button"
              class="invoice-status-btn mt-2 color-draft rounded-md border text-sm font-medium leading-4 text-gray-700"
              @click.stop="editInvoice"
            >
              Edit
            </button>
            <button
              type="button"
              class="delete-invoice-btn ml-5 p-3 fw-700 rounded-md border text-sm font-medium leading-4 text-gray-700"
              @click.stop="deleteInvoice"
            >
              Delete
            </button>
            <button
              type="button"
              class="add-invoice-btn ml-5 p-3 br-4 fw-700 rounded-md border text-sm font-medium leading-4 text-gray-700"
              @click.stop="markAsPaid"
            >
              Mark as Paid
            </button>
          </div>
        </div>
        <div class="invoice-card-div invoice-card-column mb-4">
          <div class="invoice-inner-div">
            <div style="flex-grow: 1">
              <h3>
                <span class="fw-500 text-dull">#</span
                ><span class="text-white fw-500">{{ invoiceData.id }}</span>
              </h3>
              <span class="text-wite-mute">Graphic Design</span>
            </div>
            <div style="flex-grow: 8"></div>
            <div style="flex-grow: 1">
              <div class="text-wite-mute">
                {{ invoiceData.senderAddress.street }}
              </div>
              <div class="text-wite-mute">
                {{ invoiceData.senderAddress.city }}
              </div>
              <div class="text-wite-mute">
                {{ invoiceData.senderAddress.postCode }}
              </div>
              <div class="text-wite-mute">
                {{ invoiceData.senderAddress.country }}
              </div>
            </div>
          </div>
          <div class="invoice-inner-div mb-4">
            <div style="flex-grow: 2">
              <div class="mb-4">
                <div class="text-wite-mute">Invoice Date</div>
                <h3>
                  <span class="text-white fw-500">{{
                    invoiceData.createdAt
                  }}</span>
                </h3>
              </div>
              <div>
                <div class="text-wite-mute">Payment Due</div>
                <h3>
                  <span class="text-white fw-500">{{
                    invoiceData.paymentDue
                  }}</span>
                </h3>
              </div>
            </div>
            <div style="flex-grow: 2">
              <div class="text-wite-mute">Bill To</div>
              <h3>
                <span class="text-white fw-500">{{
                  invoiceData.clientName
                }}</span>
              </h3>
              <div class="text-wite-mute">
                {{ invoiceData.clientAddress.street }}
              </div>
              <div class="text-wite-mute">
                {{ invoiceData.clientAddress.city }}
              </div>
              <div class="text-wite-mute">
                {{ invoiceData.clientAddress.postCode }}
              </div>
              <div class="text-wite-mute">
                {{ invoiceData.clientAddress.country }}
              </div>
            </div>
            <div style="flex-grow: 6">
              <div class="text-wite-mute">Sent to</div>
              <h3>
                <span class="text-white fw-500">{{
                  invoiceData.clientEmail
                }}</span>
              </h3>
            </div>
          </div>
          <div class="invoice-inner-div invoice-inner-quantity-div p-3 mb-0">
            <table class="pb-3">
              <tr>
                <th class="text-wite-mute">Item Name</th>
                <th class="text-wite-mute">Quantity</th>
                <th class="text-wite-mute">Price</th>
                <th class="text-wite-mute">Total</th>
              </tr>
              <tr v-for="item of invoiceData.items">
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>&#x20AC;{{ item.price }}</td>
                <td>&#x20AC;{{ item.total }}</td>
              </tr>
            </table>
          </div>
          <div class="invoice-inner-div p-3 invoice-inner-total-div">
            <div style="flex-grow: 1">
              <div class="text-wite-mute mt-3">Amount Due</div>
            </div>
            <div style="flex-grow: 8"></div>
            <div style="flex-grow: 1">
              <h1>
                &#x20AC;
                <span class="text-white fw-500">{{ invoiceData.total }}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showModal">
        <ModalView
          :showModal="showModal"
          @hideAddModal="hideAddModal"
          :invoiceData="invoiceData"
          @getInvoice="getInvoice"
        ></ModalView>
      </div>
      <div v-if="showDeleteModal">
        <DeleteModalView
          :showDeleteModal="showDeleteModal"
          :invoiceId="invoiceData.id"
          @hideDeleteModal="hideDeleteModal"
          @deleteInvoiceById="deleteInvoiceById"
        ></DeleteModalView>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* .invoice-view-main-div {
  margin-top: 2rem;
} */

.invoice-view-main-div .delete-invoice-btn {
  border-radius: 2rem;
  color: var(--color-heading);
  background-color: #ec5757;
  border-color: #ec5757;
}

.invoice-view-main-div .br-4 {
  border-radius: 2rem;
}

.invoice-view-main-div .invoice-back-btn {
  background-color: #141625;
  color: var(--color-heading);
  border: 0px;
}

.invoice-card-div .invoice-inner-div {
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
}
.invoice-view-main-div .invoice-card-column {
  flex-direction: column;
}
.invoice-inner-total-div {
  /* padding: 1rem; */
  background-color: #000;
}

.invoice-inner-quantity-div {
  background-color: #2e3250;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  text-align: left;
  padding: 1rem;
}

td {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-heading);
}
</style>

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import OfflineTab from "./tabs/Offline.tsx";
import MicrosoftTab from "./tabs/Microsoft.tsx";
import MojangTab from "./tabs/Mojang.tsx";

function CreateUserStepper() {
	return (
		<>
			<Tabs>
				<TabList>
					<Tab>Microsoft</Tab>
					<Tab>Mojang</Tab>
					<Tab>Offline</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<MicrosoftTab />
					</TabPanel>
					<TabPanel>
						<MojangTab />
					</TabPanel>
					<TabPanel>
						<OfflineTab />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
}

export default CreateUserStepper;

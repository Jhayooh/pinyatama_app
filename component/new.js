import React from 'react'

function New () {

    return (
        <View style={{ flex: 1, alignItems: 'center' }} >
            <ScrollView
                showsVerticalScrollIndicator={false} style={{ width: '100%' }}
            >
                {/* particulars  */}
                <View style={styles.category_container}>
                    {/* numberFour */}
                    <Text style={styles.head}>4. Farmer Details</Text>
                    <TextInput
                        editable
                        maxLength={40}
                        onChangeText={text => setFarmerName(text)}
                        placeholder='Name of Farmer'
                        value={farmerName}
                        style={styles.dropdown}
                    />
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
                        value={sex}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setSex(item.value);
                            setIsFocus(false);
                        }}
                    />
                    <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

                    <Text style={styles.head}>1. Land Area</Text>
                    {
                        <>
                            {/* Number 1 */}
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TextInput
                                    editable
                                    onChangeText={(base) => {
                                        setBase(base)
                                        setArea(parseFloat(base / 30000))
                                    }}
                                    ref={focusNumplants}
                                    placeholder='No. of plants'
                                    keyboardType='numeric'
                                    value={base}
                                    style={{ ...styles.dropdown, flex: 3 }}
                                    disabled
                                />
                                {
                                    lParti && calculating
                                        ?
                                        <ActivityIndicator style={{ flex: 1 }} size='small' color='#FF5733' />
                                        :
                                        <TouchableOpacity style={{ marginLeft: 10, justifyContent: 'center' }} onPress={() => {
                                            setCalculating(true)
                                            handleBase()
                                        }
                                        } >
                                            <Image source={require('../assets/calc.png')} style={{ width: 30, height: 30 }} />
                                        </TouchableOpacity>
                                }
                            </View>
                            {table && <TableBuilder components={components} area={area} setRoiDetails={setRoiDetails} />}
                        </>
                    }
                    <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

                    {/* Number 2 */}
                    <Text style={styles.head}>2. QP Farm Details</Text>
                    <TextInput
                        editable
                        maxLength={40}
                        onChangeText={text => setCropStage(text)}
                        placeholder='Stage of Crops'
                        value={cropStage}
                        style={styles.dropdown}
                    />
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TextInput
                            style={{ ...styles.dropdown, flex: 3 }}
                            value={startDate.toLocaleDateString()}
                            placeholder="Date of Planting"
                        />
                        <TouchableOpacity onPress={() => setStartPicker(true)} style={{ marginLeft: 10, justifyContent: 'center' }}>
                            <Image source={require('../assets/cal.png')} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={startPicker}
                            mode="date"
                            onConfirm={(date) => {
                                setStartDate(date)
                                setStartPicker(false)
                            }}
                            onCancel={() => setStartPicker(false)}
                            style={{ marginBottom: 10 }}
                        />
                    </View>

                    <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

                    {/* numberThree */}
                    <Text style={styles.head}>3. Input Farm Location</Text>
                    <TextInput
                        editable
                        maxLength={40}
                        onChangeText={text => setFarmName(text)}
                        placeholder='Enter Farm Name'
                        value={farmName}
                        style={styles.dropdown}
                    />
                    <TextInput
                        editable={false}
                        maxLength={40}
                        // placeholder='Enter Farm Name'
                        value={municipality}
                        style={styles.dropdown}
                    />
                    <TextInput
                        maxLength={40}
                        disabled={false}
                        // placeholder='Enter Farm Name'
                        value={brgyCode}
                        style={styles.dropdown}
                    />

                    <View style={styles.container1}>
                        <MapView style={styles.map} region={region} onPress={handleMapPress}>
                            {userLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: userLocation.latitude,
                                        longitude: userLocation.longitude,
                                    }}
                                    title="Your Location"
                                    description="You are here!"
                                    draggable
                                    onDragEnd={(e) => setUserLocation(e.nativeEvent.coordinate)}
                                />
                            )}
                        </MapView>
                        <View style={styles.buttonContainer}>
                            <Button title="Update Location" onPress={handleUpdateLocation} />
                        </View>
                    </View>
                    <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

                    {/* numberFive */}
                    <Text style={styles.head}>5. Upload Farm Images</Text>
                    <View style={{ marginBottom: 8, width: '100%', height: 180, borderRadius: 6, padding: 4, backgroundColor: '#101010' }}>
                        {
                            images &&
                            <FlatList
                                data={images}
                                // numColumns={3}
                                horizontal={true}
                                renderItem={({ item }) => (
                                    <View style={{ flex: 1 }}>
                                        <Image style={{ height: '100%', width: 240, borderRadius: 6 }} source={{ uri: item.url }} />
                                    </View>
                                )}
                                ItemSeparatorComponent={() =>
                                    <View style={{ width: 4, height: '100%' }}></View>
                                }
                            // columnWrapperStyle={{
                            //   gap: 2,
                            //   marginBottom: 2
                            // }}
                            />
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.touch} onPress={() => {
                                setShowAddImage(true)
                            }}>
                                <Text style={styles.text}>Add Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* ImagesGal */}
                </View>
            </ScrollView>
            <BottomButton />
        </View >
    )
}

const styles = StyleSheet.create({
    touch: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: 'center',
      textAlign: 'center',
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
      backgroundColor: 'green',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#206830',
      flex: 1,
    },
    cam: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: 'center',
      textAlign: 'center',
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#206830',
      flex: 1,
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 5,
      padding: 10,
    },
    image: {
      flex: 1,
      opacity: 1.0,
      paddingTop: 36,
    },
  
    map: {
      height: 200,
      width: '100%',
    },
  
    dropdown: {
      height: 50,
      opacity: 1.0,
      borderColor: 'green',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: 'white',
      marginBottom: 6,
      color: 'black'
    },
  
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
  
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    addImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row'
    },
    text: {
      fontSize: 15,
      fontFamily: 'serif',
      fontWeight: 'bold',
      color: 'white'
    },
    text1: {
      fontSize: 15,
      fontFamily: 'serif',
      fontWeight: 'bold',
      color: 'black'
    },
    category_container: {
      padding: 10,
      margin: 16,
      opacity: 1.0,
      borderRadius: 10,
      backgroundColor: '#fff',
      elevation: 5
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(150, 150, 150, 0.6)'
    },
    head: {
      fontSize: 20,
      fontFamily: 'serif',
      fontWeight: 'bold',
      color: 'green',
      marginBottom: 8,
    },
  
    modalContent: {
      backgroundColor: 'white',
      width: 280,
      padding: 20,
      borderRadius: 10,
      elevation: 5, // Android shadow
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 9,
    },
    verifyButton: {
      position: 'absolute',
      alignSelf: 'center',
      right: 0,
    },
  
  });

export default New